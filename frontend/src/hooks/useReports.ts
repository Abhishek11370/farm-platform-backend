import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analytics.api';

export function useReports() {
  const revenueTimeline = useQuery({ queryKey: ['reports-revenue'], queryFn: () => analyticsApi.getRevenueTimeline(30) });
  const topProducts = useQuery({ queryKey: ['reports-top-products'], queryFn: () => analyticsApi.getTopProducts(10) });
  const userGrowth = useQuery({ queryKey: ['reports-user-growth'], queryFn: () => analyticsApi.getUserGrowth() });
  const orderStats = useQuery({ queryKey: ['reports-order-stats'], queryFn: () => analyticsApi.getOrderStats() });
  const auctionStats = useQuery({ queryKey: ['reports-auction-stats'], queryFn: () => analyticsApi.getAuctionStats() });
  
  return {
    revenueTimeline,
    topProducts,
    userGrowth,
    orderStats,
    auctionStats,
  };
}
