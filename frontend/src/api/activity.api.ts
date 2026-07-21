import api from './axios';
import { ActivityLog } from '../types/analytics';

export const activityApi = {
  getAllActivities: async (): Promise<ActivityLog[]> => {
    const res = await api.get('/activity/admin').catch(() => ({ data: [] }));
    return res.data;
  },
  getUserActivities: async (): Promise<ActivityLog[]> => {
    const res = await api.get('/activity').catch(() => ({ data: [] }));
    return res.data;
  }
};
