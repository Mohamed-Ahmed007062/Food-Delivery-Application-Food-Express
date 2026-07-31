import { z } from 'zod';

export const createRestaurantSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Restaurant name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters'),
    description: z.string().optional(),
    cuisine: z.array(z.string()).optional().default([]),
    address: z.string({ required_error: 'Address is required' }),
    phone: z.string({ required_error: 'Phone is required' }),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    logo: z.string().optional(),
    coverImage: z.string().optional(),
    minimumOrder: z.number().min(0).optional().default(0),
    deliveryFee: z.number().min(0).optional().default(0),
    estimatedDeliveryTime: z.number().min(5).optional().default(30),
  }),
});

export const updateRestaurantSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().optional(),
    cuisine: z.array(z.string()).optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    logo: z.string().optional(),
    coverImage: z.string().optional(),
    minimumOrder: z.number().min(0).optional(),
    deliveryFee: z.number().min(0).optional(),
    estimatedDeliveryTime: z.number().min(5).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const queryRestaurantSchema = z.object({
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    sort: z.string().optional().default('-rating'),
    search: z.string().optional(),
    cuisine: z.string().optional(),
    minRating: z.string().optional(),
    maxDeliveryFee: z.string().optional(),
  }),
});

export const approveRestaurantSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    isApproved: z.boolean({ required_error: 'isApproved boolean is required' }),
  }),
});

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>['body'];
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>['body'];
export type QueryRestaurantInput = z.infer<typeof queryRestaurantSchema>['query'];
