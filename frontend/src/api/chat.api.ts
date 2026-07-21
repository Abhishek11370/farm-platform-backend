import api from './axios';

export const chatApi = {
  getConversations: async (): Promise<any> => {
    const res = await api.get('/chat/conversations');
    return res.data;
  },
  getAdminConversations: async (page = 1, limit = 50): Promise<any> => {
    const res = await api.get('/chat/admin/conversations', { params: { page, limit } });
    return res.data;
  },
  getMessages: async (partnerId: string, page = 1, limit = 50): Promise<any> => {
    const res = await api.get(`/chat/messages/${partnerId}`, { params: { page, limit } });
    return res.data;
  },
  sendMessage: async (receiverId: string, content: string): Promise<any> => {
    const res = await api.post('/chat/messages', { receiverId, content });
    return res.data;
  },
  deleteMessage: async (id: string): Promise<void> => {
    await api.delete(`/chat/messages/${id}`);
  }
};
