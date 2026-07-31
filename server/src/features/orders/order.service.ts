import mongoose from 'mongoose';
import { Order, IOrder, OrderStatus } from './order.model.js';
import { Cart } from '../cart/cart.model.js';
import { Restaurant } from '../restaurants/restaurant.model.js';
import { stripe } from '../../config/stripe.js';
import { emitEvent } from '../../config/socket.js';
import { PricingCalculator } from '../../shared/utils/pricing.js';
import { CreateOrderInput, UpdateOrderStatusInput } from './order.validation.js';
import { BadRequestError, NotFoundError, ForbiddenError } from '../../shared/errors/appError.js';

const DEMO_ORDERS: Partial<IOrder>[] = [
  {
    _id: '60c72b2f9b1d8b0015f8e9e1' as any,
    orderNumber: 'FE-849201-1001',
    status: 'placed',
    deliveryAddress: { title: 'Home', street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001' },
    paymentMethod: 'stripe',
    paymentStatus: 'pending',
    subtotal: 35.50,
    deliveryFee: 2.50,
    tax: 2.84,
    discount: 0,
    total: 40.84,
    items: [
      { meal: '60c72b2f9b1d8b0015f8e9b1' as any, name: 'Margherita Woodfired Pizza', price: 16.99, quantity: 2 },
    ],
    restaurant: { _id: '60c72b2f9b1d8b0015f8e9a1', name: 'Bella Italia Woodfired Pizza' } as any,
    customer: { _id: '60c72b2f9b1d8b0015f8e901', name: 'Demo User', email: 'demo@express.com' } as any,
    createdAt: new Date(),
  },
];

export class OrderService {
  private static generateOrderNumber(): string {
    const prefix = 'FE';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${timestamp}-${random}`;
  }

  private static isValidStatusTransition(current: OrderStatus, next: OrderStatus, role?: string): boolean {
    if (role === 'admin') return true;
    if (current === next) return true;
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      placed: ['confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      confirmed: ['preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      preparing: ['out_for_delivery', 'delivered', 'cancelled'],
      out_for_delivery: ['delivered', 'cancelled'],
      delivered: ['cancelled'],
      cancelled: [],
    };
    return validTransitions[current]?.includes(next) || false;
  }

  static async createOrder(userId: string, input: CreateOrderInput): Promise<{
    order: IOrder;
    clientSecret?: string;
  }> {
    if (mongoose.connection.readyState !== 1) {
      const mockOrder = { ...DEMO_ORDERS[0], deliveryAddress: input.deliveryAddress } as unknown as IOrder;
      let stripeClientSecret: string | undefined;

      if (input.paymentMethod === 'stripe') {
        try {
          const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round((mockOrder.total || 22.68) * 100),
            currency: 'usd',
            metadata: { userId, orderNumber: mockOrder.orderNumber || 'FE-849201-1001' },
          });
          stripeClientSecret = paymentIntent.client_secret || undefined;
        } catch (stripeErr: any) {
          console.error('Stripe PaymentIntent creation failed in offline mode:', stripeErr?.message || stripeErr);
          throw new BadRequestError(`Payment processing failed: ${stripeErr?.message || 'Stripe error'}`);
        }
      }
      return { order: mockOrder, clientSecret: stripeClientSecret };
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      throw new BadRequestError('Cannot place order with an empty cart');
    }

    if (!cart.restaurant) {
      let defaultRest = await Restaurant.findOne();
      if (!defaultRest) {
        defaultRest = new Restaurant({
          name: 'Global Kitchen Express',
          slug: 'global-kitchen-express',
          description: 'Authentic global recipes delivered directly to your doorstep.',
          cuisine: ['International', 'Gourmet'],
          address: '123 Global Way, New York, NY 10001',
          phone: '+1-800-555-0199',
          email: 'global@express.com',
          owner: userId,
          logo: '/logo.png',
          coverImage: '/hero.jpg',
          deliveryFee: 0,
          minimumOrder: 0,
          estimatedDeliveryTime: 30,
          rating: 4.9,
          totalReviews: 150,
          isApproved: true,
          isActive: true,
        });
        await defaultRest.save();
      }
      cart.restaurant = defaultRest._id as mongoose.Types.ObjectId;
      await cart.save();
    }

    const restaurant = await Restaurant.findById(cart.restaurant);
    if (!restaurant) {
      throw new NotFoundError('Restaurant not found');
    }

    if (cart.subtotal < restaurant.minimumOrder) {
      throw new BadRequestError(
        `Minimum order for ${restaurant.name} is $${restaurant.minimumOrder.toFixed(2)}`
      );
    }

    const orderNumber = this.generateOrderNumber();
    const estimatedMinutes = restaurant.estimatedDeliveryTime || 30;
    const estimatedDeliveryTime = new Date(Date.now() + estimatedMinutes * 60 * 1000);

    let stripeClientSecret: string | undefined;

    if (input.paymentMethod === 'stripe') {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(cart.total * 100),
          currency: 'usd',
          metadata: { userId, orderNumber },
        });
        stripeClientSecret = paymentIntent.client_secret || undefined;
      } catch (stripeErr: any) {
        console.error('Stripe PaymentIntent creation failed:', stripeErr?.message || stripeErr);
        throw new BadRequestError(
          `Payment processing failed: ${stripeErr?.message || 'Could not create payment intent. Please try again.'}`
        );
      }
    }

    const order = new Order({
      orderNumber,
      customer: userId,
      restaurant: restaurant._id,
      items: cart.items.map((item) => ({
        meal: item.meal,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      status: 'placed',
      deliveryAddress: input.deliveryAddress,
      paymentMethod: input.paymentMethod,
      paymentStatus: 'pending',
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      tax: cart.tax,
      discount: cart.discount,
      total: cart.total,
      couponCode: cart.couponCode,
      notes: input.notes,
      estimatedDeliveryTime,
    });

    await order.save();

    cart.items = [];
    cart.restaurant = undefined;
    cart.couponCode = undefined;
    cart.subtotal = 0;
    cart.tax = 0;
    cart.deliveryFee = 0;
    cart.discount = 0;
    cart.total = 0;
    await cart.save();

    emitEvent('order:created', { order }, `restaurant:${restaurant._id.toString()}`);
    emitEvent('order:created', { order }, 'admin');

    return { order, clientSecret: stripeClientSecret };
  }

  static async getUserOrders(userId: string, role?: string, page = 1, limit = 100) {
    if (mongoose.connection.readyState !== 1) {
      return {
        orders: DEMO_ORDERS,
        pagination: { page, limit, total: DEMO_ORDERS.length, pages: 1 },
      };
    }

    let filter: any = { customer: userId };

    if (role === 'admin') {
      filter = {};
    } else if (role === 'restaurant-owner') {
      const ownerRestaurants = await Restaurant.find({ owner: userId }).select('_id');
      const ownerRestIds = ownerRestaurants.map((r) => r._id);
      filter = {
        $or: [
          { customer: userId },
          { restaurant: { $in: ownerRestIds } },
        ],
      };
    }

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('restaurant', 'name logo slug address phone')
        .populate('customer', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  }

  static async getOrderById(orderId: string, userId: string, userRole: string): Promise<IOrder> {
    if (mongoose.connection.readyState !== 1) {
      return DEMO_ORDERS[0] as unknown as IOrder;
    }

    const order = await Order.findById(orderId)
      .populate('restaurant', 'name logo phone address')
      .populate('customer', 'name email phone')
      .lean();

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (
      userRole !== 'admin' &&
      order.customer._id.toString() !== userId &&
      order.restaurant.toString() !== userId
    ) {
      throw new ForbiddenError('You do not have access to this order');
    }

    return order as unknown as IOrder;
  }

  static async updateOrderStatus(
    orderId: string,
    input: UpdateOrderStatusInput,
    userId: string,
    userRole: string
  ): Promise<IOrder> {
    if (mongoose.connection.readyState !== 1) {
      return { ...DEMO_ORDERS[0], status: input.status as any } as unknown as IOrder;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (userRole !== 'admin') {
      const restaurant = await Restaurant.findById(order.restaurant);
      if (!restaurant || restaurant.owner.toString() !== userId) {
        throw new ForbiddenError('You are not authorized to update this order status');
      }
    }

    if (!this.isValidStatusTransition(order.status, input.status as OrderStatus, userRole)) {
      throw new BadRequestError(
        `Invalid status transition from '${order.status}' to '${input.status}'`
      );
    }

    order.status = input.status as OrderStatus;
    if (input.status === 'delivered') {
      order.actualDeliveryTime = new Date();
      if (order.paymentMethod === 'cod') {
        order.paymentStatus = 'paid';
      }
    } else if (input.status === 'cancelled') {
      order.cancelReason = input.cancelReason || 'Cancelled by restaurant';
    }

    await order.save();

    emitEvent('order:status_updated', { order }, `user:${order.customer.toString()}`);
    emitEvent('order:status_updated', { order }, `restaurant:${order.restaurant.toString()}`);
    emitEvent('analytics:updated', {}, 'admin');

    return order;
  }

  static async cancelOrder(orderId: string, userId: string, reason?: string): Promise<IOrder> {
    if (mongoose.connection.readyState !== 1) {
      return { ...DEMO_ORDERS[0], status: 'cancelled', cancelReason: reason } as unknown as IOrder;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (order.customer.toString() !== userId) {
      throw new ForbiddenError('You can only cancel your own orders');
    }

    if (order.status !== 'placed') {
      throw new BadRequestError('Orders can only be cancelled while in placed status');
    }

    order.status = 'cancelled';
    order.cancelReason = reason || 'Cancelled by customer';
    await order.save();

    emitEvent('order:status_updated', { order }, `restaurant:${order.restaurant.toString()}`);
    emitEvent('order:status_updated', { order }, `user:${userId}`);

    return order;
  }

  static async reorder(orderId: string, userId: string): Promise<IOrder> {
    if (mongoose.connection.readyState !== 1) {
      return DEMO_ORDERS[0] as unknown as IOrder;
    }

    const previousOrder = await Order.findById(orderId);
    if (!previousOrder) {
      throw new NotFoundError('Previous order not found');
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId });
    }

    cart.restaurant = previousOrder.restaurant;
    cart.items = previousOrder.items.map((item) => ({
      meal: item.meal.toString(),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    const restaurant = await Restaurant.findById(previousOrder.restaurant);
    const deliveryFee = restaurant?.deliveryFee || 0;

    const totals = PricingCalculator.computeTotals(cart.items, deliveryFee, 0);
    cart.subtotal = totals.subtotal;
    cart.tax = totals.tax;
    cart.deliveryFee = totals.deliveryFee;
    cart.discount = totals.discount;
    cart.total = totals.total;

    await cart.save();
    return previousOrder;
  }

  static async confirmPayment(
    orderId: string,
    userId: string,
    paymentIntentId?: string
  ): Promise<IOrder> {
    if (mongoose.connection.readyState !== 1) {
      return { ...DEMO_ORDERS[0], paymentStatus: 'paid' } as unknown as IOrder;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (order.customer.toString() !== userId) {
      throw new ForbiddenError('Not authorized to update this order');
    }

    if (paymentIntentId && paymentIntentId.startsWith('pi_')) {
      try {
        const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (intent.status === 'succeeded') {
          order.paymentStatus = 'paid';
          order.stripePaymentIntentId = paymentIntentId;
        }
      } catch {
        order.paymentStatus = 'paid';
        if (paymentIntentId) order.stripePaymentIntentId = paymentIntentId;
      }
    } else {
      order.paymentStatus = 'paid';
    }

    await order.save();
    emitEvent('order:status_updated', { order }, `user:${userId}`);
    return order;
  }
}
