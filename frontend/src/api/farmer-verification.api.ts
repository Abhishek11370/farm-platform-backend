import api from './axios';

export interface ReviewVerificationPayload {
  status: 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}

export const farmerVerificationApi = {
  getVerifications: async (page = 1, limit = 20, status?: string): Promise<any> => {
    const res = await api.get('/farmer-verification', { params: { page, limit, status } });
    return res.data;
  },
  getVerification: async (id: string): Promise<any> => {
    const res = await api.get(`/farmer-verification/${id}`);
    return res.data;
  },
  reviewVerification: async (id: string, data: ReviewVerificationPayload): Promise<any> => {
    const res = await api.patch(`/farmer-verification/${id}/review`, data);
    return res.data;
  },
};
