import api from './axios';
import type {
  DashboardStats,
  RevenueTimelinePoint,
  TopProduct,
  UserGrowthPoint,
  OrderStatusStat,
  AuctionStats,
  ActivityLog,
} from '../types/analytics';

export const analyticsApi = {
  /** GET /analytics/dashboard – KPI summary */
  getDashboard: async (): Promise<DashboardStats> => {
    const { data } = await api.get('/analytics/dashboard');
    return data?.data ?? data;
  },

  /** GET /analytics/revenue?days=N – Revenue timeline */
  getRevenueTimeline: async (days = 30): Promise<RevenueTimelinePoint[]> => {
    const { data } = await api.get('/analytics/revenue', { params: { days } });
    return data?.data ?? data;
  },

  /** GET /analytics/top-products?limit=N – Best selling products */
  getTopProducts: async (limit = 10): Promise<TopProduct[]> => {
    const { data } = await api.get('/analytics/top-products', { params: { limit } });
    return data?.data ?? data;
  },

  /** GET /analytics/user-growth – User growth by month */
  getUserGrowth: async (): Promise<UserGrowthPoint[]> => {
    const { data } = await api.get('/analytics/user-growth');
    return data?.data ?? data;
  },

  /** GET /analytics/orders – Order status distribution */
  getOrderStats: async (): Promise<OrderStatusStat[]> => {
    const { data } = await api.get('/analytics/orders');
    return data?.data ?? data;
  },

  /** GET /analytics/auctions – Auction stats */
  getAuctionStats: async (): Promise<AuctionStats> => {
    const { data } = await api.get('/analytics/auctions');
    return data?.data ?? data;
  },

  /** GET /analytics/farmer - Farmer dashboard stats */
  getFarmerAnalytics: async (): Promise<any> => {
    const { data } = await api.get('/analytics/farmer');
    return data?.data ?? data;
  },

  /** GET /activity/admin – Recent activity logs */
  getRecentActivity: async (): Promise<ActivityLog[]> => {
    const { data } = await api.get('/activity/admin');
    return data?.data ?? data;
  },

  /** GET /analytics/ai-insights - AI generated insights */
  getAIInsights: async (): Promise<any> => {
    const { data } = await api.get('/analytics/ai-insights');
    return data?.data ?? data;
  },
};
