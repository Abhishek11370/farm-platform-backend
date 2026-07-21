import api from './axios';

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment?: string;
}

export const reviewsApi = {
  createReview: async (data: CreateReviewPayload): Promise<any> => {
    const res = await api.post('/reviews', data);
    return res.data;
  },
  getReviewsByProduct: async (productId: string, page = 1, limit = 10): Promise<any> => {
    const res = await api.get(`/reviews/product/${productId}`, { params: { page, limit } });
    return res.data;
  },
  getMyReviews: async (): Promise<any[]> => {
    const res = await api.get('/reviews/mine');
    return res.data;
  },
  deleteReview: async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },
  getAllReviews: async (page = 1, limit = 50): Promise<any> => {
    // Try admin endpoint first, fall back to paginated product-less endpoint
    const res = await api.get('/reviews', { params: { page, limit } });
    const raw = res.data;
    if (Array.isArray(raw)) return { data: raw, meta: { total: raw.length } };
    if (Array.isArray(raw?.data)) return raw;
    return { data: [], meta: { total: 0 } };
  },
};
