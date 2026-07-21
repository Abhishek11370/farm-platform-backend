import api from './axios';

export const orderApi = {
  getOrders: async () => {
    // Check if the backend has /order or /orders endpoint
    const response = await api.get('/order').catch(() => api.get('/orders'));
    return response.data;
  },
  getOrderById: async (id: string) => {
    const response = await api.get(`/order/${id}`).catch(() => api.get(`/orders/${id}`));
    return response.data;
  }
};
