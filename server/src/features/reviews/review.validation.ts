import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    restaurant: z.string({ required_error: 'Restaurant ID is required' }),
    order: z.string().optional(),
    rating: z
      .number({ required_error: 'Rating is required' })
      .min(1, 'Rating must be between 1 and 5')
      .max(5, 'Rating must be between 1 and 5'),
    comment: z
      .string({ required_error: 'Comment is required' })
      .min(5, 'Comment must be at least 5 characters')
      .max(500, 'Comment cannot exceed 500 characters'),
  }),
});

export const updateReviewSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().min(5).max(500).optional(),
  }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>['body'];
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>['body'];
