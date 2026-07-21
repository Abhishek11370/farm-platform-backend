import api from './axios';

export interface AssignDeliveryPayload {
  orderId: string;
  agentId: string;
  pickupAddr: string;
}

export const deliveryApi = {
  getDeliveries: async (params?: any): Promise<any> => {
    const res = await api.get('/delivery', { params });
    return res.data;
  },
  assignDelivery: async (data: AssignDeliveryPayload): Promise<any> => {
    const res = await api.post('/delivery/assign', data);
    return res.data;
  },
  getAdminEarnings: async (): Promise<any> => {
    const res = await api.get('/delivery/admin-earnings');
    return res.data;
  },
};
