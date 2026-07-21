import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analytics.api';

export function useAnalytics() {
  const dashboardQuery = useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: analyticsApi.getDashboard,
  });

  const revenueTimelineQuery = useQuery({
    queryKey: ['analytics', 'revenue'],
    queryFn: () => analyticsApi.getRevenueTimeline(30),
  });

  const topProductsQuery = useQuery({
    queryKey: ['analytics', 'top-products'],
    queryFn: () => analyticsApi.getTopProducts(10),
  });

  const userGrowthQuery = useQuery({
    queryKey: ['analytics', 'user-growth'],
    queryFn: analyticsApi.getUserGrowth,
  });

  const orderStatsQuery = useQuery({
    queryKey: ['analytics', 'orders'],
    queryFn: analyticsApi.getOrderStats,
  });

  const auctionStatsQuery = useQuery({
    queryKey: ['analytics', 'auctions'],
    queryFn: analyticsApi.getAuctionStats,
  });

  const recentActivityQuery = useQuery({
    queryKey: ['analytics', 'activity'],
    queryFn: analyticsApi.getRecentActivity,
  });

  return {
    dashboard: dashboardQuery,
    revenueTimeline: revenueTimelineQuery,
    topProducts: topProductsQuery,
    userGrowth: userGrowthQuery,
    orderStats: orderStatsQuery,
    auctionStats: auctionStatsQuery,
    recentActivity: recentActivityQuery,
  };
}
