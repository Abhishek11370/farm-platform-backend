import api from './axios';

export interface CreateCouponPayload {
  code: string;
  discountPercent: number;
  maxUsage: number;
  expiresAt: string;
  minOrderAmount?: number;
}

export const couponsApi = {
  getCoupons: async (page = 1, limit = 20): Promise<any> => {
    const res = await api.get('/coupons', { params: { page, limit } });
    return res.data;
  },
  getCoupon: async (id: string): Promise<any> => {
    const res = await api.get(`/coupons/${id}`);
    return res.data;
  },
  createCoupon: async (data: CreateCouponPayload): Promise<any> => {
    const res = await api.post('/coupons', data);
    return res.data;
  },
  validateCoupon: async (code: string): Promise<any> => {
    const res = await api.post('/coupons/validate', { code });
    return res.data;
  },
  toggleCoupon: async (id: string, isActive: boolean): Promise<any> => {
    const res = await api.patch(`/coupons/${id}/toggle`, { isActive });
    return res.data;
  },
  deleteCoupon: async (id: string): Promise<void> => {
    await api.delete(`/coupons/${id}`);
  },
};
