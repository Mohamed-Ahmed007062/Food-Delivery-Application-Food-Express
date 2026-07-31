import { apiClient } from '../../../lib/axios.js';

export interface IRestaurant {
  _id: string;
  name: string;
  slug: string;
  description: string;
  cuisine: string[];
  address: string;
  phone: string;
  email: string;
  logo: string;
  coverImage: string;
  rating: number;
  totalReviews: number;
  minimumOrder: number;
  deliveryFee: number;
  estimatedDeliveryTime: number;
}

export interface RestaurantQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  cuisine?: string;
  minRating?: number;
  sort?: string;
}

export const restaurantService = {
  async getRestaurants(params: RestaurantQueryParams = {}) {
    const res: any = await apiClient.get('/restaurants', { params });
    return res;
  },

  async getFeatured(): Promise<IRestaurant[]> {
    const res: any = await apiClient.get('/restaurants/featured');
    return res.data.restaurants;
  },

  async getById(idOrSlug: string): Promise<IRestaurant> {
    const res: any = await apiClient.get(`/restaurants/${idOrSlug}`);
    return res.data.restaurant;
  },
};
