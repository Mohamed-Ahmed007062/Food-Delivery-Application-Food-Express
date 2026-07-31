import { z } from 'zod';

export const addToCartSchema = z.object({
  body: z.object({
    mealId: z.string({ required_error: 'Meal ID is required' }),
    quantity: z.number().min(1, 'Quantity must be at least 1').optional().default(1),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({ mealId: z.string() }),
  body: z.object({
    quantity: z.number().min(0, 'Quantity cannot be negative'),
  }),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>['body'];
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>['body'];
