import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    deliveryAddress: z.object({
      title: z.string({ required_error: 'Address title is required' }),
      street: z.string({ required_error: 'Street is required' }),
      city: z.string({ required_error: 'City is required' }),
      state: z.string({ required_error: 'State is required' }),
      zipCode: z.string({ required_error: 'Zip code is required' }),
    }),
    paymentMethod: z.enum(['stripe', 'cod'], {
      errorMap: () => ({ message: 'Payment method must be stripe or cod' }),
    }),
    notes: z.string().optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    status: z.enum(['confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']),
    cancelReason: z.string().optional(),
  }),
});

export const cancelOrderSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    reason: z.string().optional(),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>['body'];
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>['body'];
