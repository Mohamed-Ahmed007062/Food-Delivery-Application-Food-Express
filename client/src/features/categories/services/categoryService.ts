import { apiClient } from '../../../lib/axios.js';

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export const categoryService = {
  async getCategories(restaurantId?: string): Promise<ICategory[]> {
    const res: any = await apiClient.get('/categories', {
      params: restaurantId ? { restaurantId } : {},
    });
    return res.data.categories;
  },
};
