import { apiClient } from '../../../lib/axios.js';

export interface IMeal {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: { _id: string; name: string; slug: string } | string;
  restaurant: { _id: string; name: string; slug: string; logo?: string } | string;
  country?: string;
  isAvailable: boolean;
  isPopular: boolean;
  preparationTime: number;
  ingredients: string[];
  allergens: string[];
  nutritionInfo?: { calories?: number; protein?: number; carbs?: number; fat?: number };
}

export interface MealQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  area?: string;
  restaurantId?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  isPopular?: boolean;
}

export const mealService = {
  async getMeals(params: MealQueryParams = {}) {
    const res: any = await apiClient.get('/meals', { params });
    return res;
  },

  async getPopular(): Promise<IMeal[]> {
    const res: any = await apiClient.get('/meals/popular');
    return res.data.meals;
  },

  async getAreas(): Promise<Array<{ area: string; country: string }>> {
    const res: any = await apiClient.get('/meals/areas');
    return res.data.areas;
  },

  async getById(id: string): Promise<IMeal> {
    const res: any = await apiClient.get(`/meals/${id}`);
    return res.data.meal;
  },
};
