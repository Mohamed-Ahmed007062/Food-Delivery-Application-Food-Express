import { z } from 'zod';

export const createMealSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Meal name is required' }).min(2).max(100),
    description: z.string().optional().default(''),
    price: z.number({ required_error: 'Price is required' }).min(0),
    image: z.string().optional().default('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'),
    category: z.string().optional().default('Main Course'),
    restaurant: z.string().optional(),
    isAvailable: z.boolean().optional().default(true),
    isPopular: z.boolean().optional().default(false),
    preparationTime: z.number().min(1).optional().default(15),
    ingredients: z.array(z.string()).optional().default([]),
    allergens: z.array(z.string()).optional().default([]),
    nutritionInfo: z
      .object({
        calories: z.number().min(0).optional(),
        protein: z.number().min(0).optional(),
        carbs: z.number().min(0).optional(),
        fat: z.number().min(0).optional(),
      })
      .optional(),
  }),
});

export const updateMealSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().optional(),
    price: z.number().min(0).optional(),
    image: z.string().optional(),
    category: z.string().optional(),
    isAvailable: z.boolean().optional(),
    isPopular: z.boolean().optional(),
    preparationTime: z.number().min(1).optional(),
    ingredients: z.array(z.string()).optional(),
    allergens: z.array(z.string()).optional(),
  }),
});

export const queryMealSchema = z.object({
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('12'),
    sort: z.string().optional().default('-createdAt'),
    search: z.string().optional(),
    area: z.string().optional(),
    restaurantId: z.string().optional(),
    categoryId: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    isPopular: z.string().optional(),
  }),
});

export type CreateMealInput = z.infer<typeof createMealSchema>['body'];
export type UpdateMealInput = z.infer<typeof updateMealSchema>['body'];
export type QueryMealInput = z.infer<typeof queryMealSchema>['query'];
