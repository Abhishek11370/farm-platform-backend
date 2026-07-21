import api from './axios';

export const supportApi = {
  getTickets: () => api.get('/support').then(res => res.data),
  getTicket: (id: string) => api.get(`/support/${id}`).then(res => res.data),
  replyToTicket: (id: string, message: string) => api.patch(`/support/${id}/reply`, { message }).then(res => res.data),
  closeTicket: (id: string) => api.patch(`/support/${id}/close`).then(res => res.data),
};
