import api from './axios';

export const activityApi = {
  getActivities: async () => {
    const response = await api.get('/activity').catch(() => ({ data: [] }));
    return response.data;
  }
};
