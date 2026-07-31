import { apiClient } from '../../../lib/axios.js';

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface IOrder {
  _id: string;
  orderNumber: string;
  restaurant: { _id: string; name: string; logo?: string; phone?: string; address?: string };
  customer: { _id: string; name: string; email: string };
  items: Array<{ meal: string; name: string; price: number; quantity: number; image?: string }>;
  status: OrderStatus;
  deliveryAddress: { title: string; street: string; city: string; state: string; zipCode: string };
  paymentMethod: 'stripe' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  couponCode?: string;
  notes?: string;
  cancelReason?: string;
  estimatedDeliveryTime?: string;
  createdAt: string;
}

export const orderService = {
  async createOrder(data: {
    deliveryAddress: { title: string; street: string; city: string; state: string; zipCode: string };
    paymentMethod: 'stripe' | 'cod';
    notes?: string;
  }): Promise<{ order: IOrder; clientSecret?: string }> {
    const res: any = await apiClient.post('/orders', data);
    return res.data;
  },

  async getUserOrders(page = 1) {
    const res: any = await apiClient.get('/orders', { params: { page } });
    return res;
  },

  async getOrderById(id: string): Promise<IOrder> {
    const res: any = await apiClient.get(`/orders/${id}`);
    return res.data.order;
  },

  async cancelOrder(id: string, reason?: string): Promise<IOrder> {
    const res: any = await apiClient.post(`/orders/${id}/cancel`, { reason });
    return res.data.order;
  },

  async reorder(id: string): Promise<void> {
    await apiClient.post(`/orders/${id}/reorder`);
  },

  async confirmPayment(id: string, paymentIntentId?: string): Promise<IOrder> {
    const res: any = await apiClient.post(`/orders/${id}/confirm-payment`, { paymentIntentId });
    return res.data.order;
  },
};
