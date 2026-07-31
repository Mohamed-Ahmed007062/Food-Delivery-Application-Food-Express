import { Coupon, ICoupon } from './coupon.model.js';
import { CreateCouponInput, ValidateCouponInput } from './coupon.validation.js';
import { BadRequestError, NotFoundError } from '../../shared/errors/appError.js';

export class CouponService {
  static async validateCoupon(input: ValidateCouponInput): Promise<{
    coupon: ICoupon;
    discountAmount: number;
  }> {
    const coupon = await Coupon.findOne({
      code: input.code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      throw new NotFoundError('Invalid coupon code');
    }

    const now = new Date();
    if (coupon.endDate < now) {
      throw new BadRequestError('Coupon code has expired');
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestError('Coupon code usage limit reached');
    }

    if (input.cartTotal < coupon.minimumOrder) {
      throw new BadRequestError(
        `Minimum order amount of $${coupon.minimumOrder.toFixed(2)} required for this coupon`
      );
    }

    if (
      coupon.applicableRestaurants &&
      coupon.applicableRestaurants.length > 0 &&
      input.restaurantId
    ) {
      const isApplicable = coupon.applicableRestaurants.some(
        (r) => r.toString() === input.restaurantId
      );
      if (!isApplicable) {
        throw new BadRequestError('Coupon is not valid for this restaurant');
      }
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (input.cartTotal * coupon.discountValue) / 100;
      if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
        discountAmount = coupon.maximumDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    return { coupon, discountAmount: Math.min(discountAmount, input.cartTotal) };
  }

  static async createCoupon(input: CreateCouponInput): Promise<ICoupon> {
    const coupon = new Coupon({
      ...input,
      code: input.code.toUpperCase(),
      endDate: new Date(input.endDate),
    });
    return coupon.save();
  }

  static async getCoupons(): Promise<ICoupon[]> {
    return Coupon.find({ isActive: true, endDate: { $gt: new Date() } }).lean() as unknown as ICoupon[];
  }
}
