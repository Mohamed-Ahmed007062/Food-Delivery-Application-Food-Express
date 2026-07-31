import { apiClient } from '../../../lib/axios.js';

export interface IReview {
  _id: string;
  user: { _id: string; name: string; avatar?: string };
  restaurant: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const reviewService = {
  async getRestaurantReviews(restaurantId: string, page = 1) {
    const res: any = await apiClient.get(`/reviews/restaurant/${restaurantId}`, {
      params: { page },
    });
    return res;
  },

  async createReview(data: { restaurant: string; rating: number; comment: string }) {
    return apiClient.post('/reviews', data);
  },
};
