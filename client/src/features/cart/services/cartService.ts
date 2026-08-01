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

const extractCart = (res: any): ICart => {
  return res?.data?.cart || res?.cart || res?.data || res;
};

export const cartService = {
  async getCart(): Promise<ICart> {
    const res: any = await apiClient.get('/cart');
    return extractCart(res);
  },

  async addItem(mealId: string, quantity = 1): Promise<ICart> {
    const res: any = await apiClient.post('/cart/items', { mealId, quantity });
    return extractCart(res);
  },

  async updateQuantity(mealId: string, quantity: number): Promise<ICart> {
    const res: any = await apiClient.put(`/cart/items/${mealId}`, { quantity });
    return extractCart(res);
  },

  async removeItem(mealId: string): Promise<ICart> {
    const res: any = await apiClient.delete(`/cart/items/${mealId}`);
    return extractCart(res);
  },

  async clearCart(): Promise<ICart> {
    const res: any = await apiClient.delete('/cart');
    return extractCart(res);
  },

  async validateCoupon(code: string, cartTotal: number, restaurantId?: string) {
    const res: any = await apiClient.post('/coupons/validate', { code, cartTotal, restaurantId });
    return res?.data || res;
  },

  async applyCoupon(code: string): Promise<{ cart: ICart; discountAmount: number }> {
    const res: any = await apiClient.post('/cart/coupon', { code });
    return {
      cart: extractCart(res),
      discountAmount: res?.data?.discountAmount || res?.discountAmount || 0,
    };
  },

  async removeCoupon(): Promise<ICart> {
    const res: any = await apiClient.delete('/cart/coupon');
    return extractCart(res);
  },
};
