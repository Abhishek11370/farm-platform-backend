import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analytics.api';

/** Fetches all dashboard data as parallel queries with auto-refresh */
export function useDashboardData() {
  const dashboard = useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: analyticsApi.getDashboard,
    refetchInterval: 60_000, // auto-refresh every 60s
  });

  const revenue = useQuery({
    queryKey: ['analytics', 'revenue'],
    queryFn: () => analyticsApi.getRevenueTimeline(30),
    refetchInterval: 120_000,
  });

  const topProducts = useQuery({
    queryKey: ['analytics', 'top-products'],
    queryFn: () => analyticsApi.getTopProducts(10),
    refetchInterval: 120_000,
  });

  const userGrowth = useQuery({
    queryKey: ['analytics', 'user-growth'],
    queryFn: analyticsApi.getUserGrowth,
    refetchInterval: 120_000,
  });

  const orderStats = useQuery({
    queryKey: ['analytics', 'order-stats'],
    queryFn: analyticsApi.getOrderStats,
    refetchInterval: 120_000,
  });

  const auctionStats = useQuery({
    queryKey: ['analytics', 'auction-stats'],
    queryFn: analyticsApi.getAuctionStats,
    refetchInterval: 120_000,
  });

  const recentActivity = useQuery({
    queryKey: ['analytics', 'recent-activity'],
    queryFn: analyticsApi.getRecentActivity,
    refetchInterval: 30_000, // refresh activity feed more frequently
  });

  return {
    dashboard,
    revenue,
    topProducts,
    userGrowth,
    orderStats,
    auctionStats,
    recentActivity,
  };
}
