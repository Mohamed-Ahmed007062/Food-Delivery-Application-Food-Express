import mongoose from 'mongoose';
import { Cart, ICart } from './cart.model.js';
import { Meal } from '../meals/meal.model.js';
import { Restaurant } from '../restaurants/restaurant.model.js';
import { AddToCartInput } from './cart.validation.js';
import { PricingCalculator } from '../../shared/utils/pricing.js';
import { NotFoundError } from '../../shared/errors/appError.js';
import { MealDBService } from '../../shared/services/mealDbService.js';
import { CouponService } from '../coupons/coupon.service.js';




export class CartService {
  private static calculateCartTotals(cart: ICart, deliveryFee = 0) {
    const totals = PricingCalculator.computeTotals(cart.items, deliveryFee, cart.discount);
    cart.subtotal = totals.subtotal;
    cart.tax = totals.tax;
    cart.deliveryFee = totals.deliveryFee;
    cart.discount = totals.discount;
    cart.total = totals.total;
  }

  static async getCart(userId: string): Promise<ICart> {

    let cart = await Cart.findOne({ user: userId }).populate(
      'restaurant',
      'name slug deliveryFee minimumOrder'
    );
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        tax: 0,
        discount: 0,
        total: 0,
      });
      await cart.save();
    }
    return cart;
  }

  static async addItem(userId: string, input: AddToCartInput): Promise<ICart> {

    let meal: any;
    if (input.mealId.startsWith('mealdb_')) {
      meal = await MealDBService.lookupById(input.mealId.replace('mealdb_', ''));
    } else if (input.mealId.startsWith('offline_')) {
      const parts = input.mealId.split('_');
      const countryKey = parts[1] || 'japan';
      const items = await MealDBService.fetchMealsByCountry(countryKey);
      meal = items.find((m) => m._id === input.mealId) || items[0];
    } else if (mongoose.Types.ObjectId.isValid(input.mealId)) {
      meal = await Meal.findById(input.mealId);
    } else {
      meal = await MealDBService.lookupById(input.mealId);
    }

    if (!meal) throw new NotFoundError('Meal not available');

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    const isExternalRecipe = input.mealId.startsWith('mealdb_') || input.mealId.startsWith('offline_');
    let localRestaurantId = isExternalRecipe ? undefined : (meal.restaurant as mongoose.Types.ObjectId);
    if (!localRestaurantId && !cart.restaurant) {
      const defaultRest = await Restaurant.findOne();
      if (defaultRest) {
        localRestaurantId = defaultRest._id as mongoose.Types.ObjectId;
      }
    }

    const targetRestId = localRestaurantId || cart.restaurant;
    const restaurant = targetRestId ? await Restaurant.findById(targetRestId) : null;
    const deliveryFee = restaurant?.deliveryFee || 0;

    if (localRestaurantId && cart.restaurant && cart.restaurant.toString() !== localRestaurantId.toString()) {
      cart.restaurant = localRestaurantId;
      cart.items = [];
      cart.couponCode = undefined;
      cart.discount = 0;
    } else if (targetRestId && !cart.restaurant) {
      cart.restaurant = targetRestId;
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.meal.toString() === input.mealId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += input.quantity;
    } else {
      cart.items.push({
        meal: input.mealId,
        name: meal.name,
        price: meal.price,
        quantity: input.quantity,
        image: meal.image,
      });
    }

    this.calculateCartTotals(cart, deliveryFee);
    await cart.save();
    return this.getCart(userId);
  }

  static async updateQuantity(userId: string, mealId: string, quantity: number): Promise<ICart> {

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundError('Cart not found');
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((item) => item.meal.toString() !== mealId);
    } else {
      const item = cart.items.find((item) => item.meal.toString() === mealId);
      if (item) {
        item.quantity = quantity;
      }
    }

    if (cart.items.length === 0) {
      cart.restaurant = undefined;
      cart.couponCode = undefined;
      cart.discount = 0;
    }

    const restaurant = cart.restaurant ? await Restaurant.findById(cart.restaurant) : null;
    this.calculateCartTotals(cart, restaurant?.deliveryFee || 0);

    await cart.save();
    return this.getCart(userId);
  }

  static async removeItem(userId: string, mealId: string): Promise<ICart> {
    return this.updateQuantity(userId, mealId, 0);
  }

  static async clearCart(userId: string): Promise<ICart> {

    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      cart.restaurant = undefined;
      cart.couponCode = undefined;
      cart.discount = 0;
      cart.subtotal = 0;
      cart.tax = 0;
      cart.deliveryFee = 0;
      cart.total = 0;
      await cart.save();
    }
    return this.getCart(userId);
  }

  static async applyCoupon(userId: string, code: string): Promise<{ cart: ICart; discountAmount: number }> {

    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      throw new NotFoundError('Cart is empty');
    }

    const { coupon, discountAmount } = await CouponService.validateCoupon({
      code,
      cartTotal: cart.subtotal,
      restaurantId: cart.restaurant ? cart.restaurant.toString() : undefined,
    });

    cart.couponCode = coupon.code;
    cart.discount = discountAmount;

    const restaurant = cart.restaurant ? await Restaurant.findById(cart.restaurant) : null;
    this.calculateCartTotals(cart, restaurant?.deliveryFee || 0);

    await cart.save();
    const updatedCart = await this.getCart(userId);
    return { cart: updatedCart, discountAmount };
  }

  static async removeCoupon(userId: string): Promise<ICart> {

    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.couponCode = undefined;
      cart.discount = 0;

      const restaurant = cart.restaurant ? await Restaurant.findById(cart.restaurant) : null;
      this.calculateCartTotals(cart, restaurant?.deliveryFee || 0);
      await cart.save();
    }
    return this.getCart(userId);
  }
}
