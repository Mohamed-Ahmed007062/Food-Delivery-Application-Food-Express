import { apiClient } from '../../../lib/axios.js';

export interface ICartItem {
  _id?: string;
  meal: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ICart {
  _id: string;
  restaurant?: { _id: string; name: string; deliveryFee: number; minimumOrder: number };
  items: ICartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  couponCode?: string;
}

export const cartService = {
  async getCart(): Promise<ICart> {
    const res: any = await apiClient.get('/cart');
    return res.data.cart;
  },

  async addItem(mealId: string, quantity = 1): Promise<ICart> {
    const res: any = await apiClient.post('/cart/items', { mealId, quantity });
    return res.data.cart;
  },

  async updateQuantity(mealId: string, quantity: number): Promise<ICart> {
    const res: any = await apiClient.put(`/cart/items/${mealId}`, { quantity });
    return res.data.cart;
  },

  async removeItem(mealId: string): Promise<ICart> {
    const res: any = await apiClient.delete(`/cart/items/${mealId}`);
    return res.data.cart;
  },

  async clearCart(): Promise<ICart> {
    const res: any = await apiClient.delete('/cart');
    return res.data.cart;
  },

  async validateCoupon(code: string, cartTotal: number, restaurantId?: string) {
    const res: any = await apiClient.post('/coupons/validate', { code, cartTotal, restaurantId });
    return res.data;
  },

  async applyCoupon(code: string): Promise<{ cart: ICart; discountAmount: number }> {
    const res: any = await apiClient.post('/cart/coupon', { code });
    return res.data;
  },

  async removeCoupon(): Promise<ICart> {
    const res: any = await apiClient.delete('/cart/coupon');
    return res.data.cart;
  },
};
