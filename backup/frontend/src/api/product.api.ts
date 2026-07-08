import api from './axios';

export const productApi = {
  getProducts: async () => {
    const response = await api.get('/product');
    return response.data;
  },
  getProductById: async (id: string) => {
    const response = await api.get(`/product/${id}`);
    return response.data;
  }
};
