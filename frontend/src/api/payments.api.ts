import api from './axios';

export interface CreatePaymentPayload {
  orderId: string;
  amount: number;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const paymentsApi = {
  createPaymentOrder: async (data: CreatePaymentPayload): Promise<any> => {
    const res = await api.post('/payments/create-order', data);
    return res.data;
  },
  verifyPayment: async (data: VerifyPaymentPayload): Promise<any> => {
    const res = await api.post('/payments/verify', data);
    return res.data;
  },
  getPaymentByOrder: async (orderId: string): Promise<any> => {
    const res = await api.get(`/payments/order/${orderId}`);
    return res.data;
  },
  getAllPayments: async (page = 1, limit = 20): Promise<any> => {
    const res = await api.get('/payments', { params: { page, limit } });
    return res.data;
  },
};
