import mongoose from 'mongoose';
import { Coupon } from '../../features/coupons/coupon.model.js';
import { env } from '../../config/env.js';

async function seedCoupons() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('🍃 Connected to MongoDB to seed coupons...');

    await Coupon.deleteMany({});
    console.log('🧹 Cleaned existing coupons');

    const coupons = [
      {
        code: 'WELCOME20',
        description: '20% off your entire order (No minimum order required)',
        discountType: 'percentage',
        discountValue: 20,
        minimumOrder: 0,
        endDate: new Date('2030-01-01'),
        isActive: true,
      },
      {
        code: 'SAVE10',
        description: '$10 off orders of $10 or more',
        discountType: 'fixed',
        discountValue: 10,
        minimumOrder: 10,
        endDate: new Date('2030-01-01'),
        isActive: true,
      },
      {
        code: 'FOOD50',
        description: '50% off up to $20 discount',
        discountType: 'percentage',
        discountValue: 50,
        maximumDiscount: 20,
        minimumOrder: 0,
        endDate: new Date('2030-01-01'),
        isActive: true,
      },
      {
        code: 'FREE5',
        description: '$5 instant discount on any order',
        discountType: 'fixed',
        discountValue: 5,
        minimumOrder: 0,
        endDate: new Date('2030-01-01'),
        isActive: true,
      },
    ];

    await Coupon.insertMany(coupons);
    console.log('✅ 4 Active Coupons created successfully in MongoDB!');
    console.log('Coupons:', coupons.map((c) => c.code).join(', '));
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed coupons:', error);
    process.exit(1);
  }
}

seedCoupons();
