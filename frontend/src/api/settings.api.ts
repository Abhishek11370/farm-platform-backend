import api from './axios';

export const settingsApi = {
  getSettings: () => api.get('/settings').then(res => res.data),
  bulkUpsert: (settings: { key: string; value: string }[]) => 
    api.post('/settings/bulk', { settings }).then(res => res.data),
};
