import api from './axios';

export interface SendNotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: 'ORDER_UPDATE' | 'SYSTEM_ALERT' | 'PROMOTIONAL' | 'PAYMENT' | 'AUCTION';
}

export const notificationsApi = {
  getMine: async (page = 1, limit = 20): Promise<any> => {
    const res = await api.get('/notifications', { params: { page, limit } });
    return res.data;
  },
  getAllAdmin: async (page = 1, limit = 20): Promise<any> => {
    const res = await api.get('/notifications/admin/all', { params: { page, limit } });
    return res.data;
  },
  sendNotification: async (data: SendNotificationPayload): Promise<any> => {
    const res = await api.post('/notifications/send', data);
    return res.data;
  },
  markRead: async (id: string): Promise<any> => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  },
  markAllRead: async (): Promise<any> => {
    const res = await api.patch('/notifications/read-all');
    return res.data;
  },
  deleteNotification: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};
