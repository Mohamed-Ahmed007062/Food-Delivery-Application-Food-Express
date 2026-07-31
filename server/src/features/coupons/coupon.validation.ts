import { z } from 'zod';

export const createCouponSchema = z.object({
  body: z.object({
    code: z.string({ required_error: 'Coupon code is required' }).min(3).max(20),
    description: z.string().optional(),
    discountType: z.enum(['percentage', 'fixed']),
    discountValue: z.number().min(0),
    minimumOrder: z.number().min(0).optional().default(0),
    maximumDiscount: z.number().min(0).optional(),
    endDate: z.string({ required_error: 'End date is required' }),
    usageLimit: z.number().min(1).optional().default(100),
    applicableRestaurants: z.array(z.string()).optional().default([]),
  }),
});

export const validateCouponSchema = z.object({
  body: z.object({
    code: z.string({ required_error: 'Coupon code is required' }),
    cartTotal: z.number().min(0),
    restaurantId: z.string().optional(),
  }),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>['body'];
export type ValidateCouponInput = z.infer<typeof validateCouponSchema>['body'];
