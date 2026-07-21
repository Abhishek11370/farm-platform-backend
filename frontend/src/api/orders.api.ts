import api from './axios';

export interface CreateOrderPayload {
  addressId: string;
  items: { productId: string; quantity: number }[];
  couponCode?: string;
}

export interface UpdateOrderStatusPayload {
  status: string;
}

export const ordersApi = {
  getOrders: async (): Promise<any[]> => {
    const res = await api.get('/orders');
    return res.data;
  },
  getAllOrdersAdmin: async (): Promise<any[]> => {
    const res = await api.get('/orders/admin/all');
    return Array.isArray(res.data) ? res.data : res.data?.data ?? [];
  },
  getOrder: async (id: string): Promise<any> => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
  createOrder: async (data: CreateOrderPayload): Promise<any> => {
    const res = await api.post('/orders', data);
    return res.data;
  },
  updateOrderStatus: async (id: string, data: UpdateOrderStatusPayload): Promise<any> => {
    const res = await api.patch(`/orders/${id}/status`, data);
    return res.data;
  },
  deleteOrder: async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },
};
