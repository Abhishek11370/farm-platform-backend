import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDashboardData } from '../hooks/useDashboardData';
import StatCard from '../components/dashboard/StatCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import {
  RevenueChart,
  OrderStatusChart,
  UserGrowthChart,
  AuctionChart,
  TopProductsChart,
} from '../components/dashboard/Charts';
import {
  Users,
  Tractor,
  Package,
  ShoppingCart,
  CreditCard,
  Gavel,
  Star,
  Heart,
  Bell,
  Tag,
  Ticket,
  ShieldCheck,
  TrendingUp,
  CheckCircle,
  XCircle,
  Truck,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    dashboard,
    revenue,
    topProducts,
    userGrowth,
    orderStats,
    auctionStats,
    recentActivity,
  } = useDashboardData();

  const stats = dashboard.data;
  const isLoading = dashboard.isLoading;
  const errorMsg = dashboard.error ? 'Failed to load dashboard data' : null;

  // Derive order breakdown from orderStats query
  const orderBreakdown = orderStats.data || [];
  const activeOrders = orderBreakdown
    .filter((o: any) => ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(o.status))
    .reduce((sum: number, o: any) => sum + (Number(o.count) || 0), 0);
  const deliveredOrders = orderBreakdown
    .filter((o: any) => o.status === 'DELIVERED')
    .reduce((sum: number, o: any) => sum + (Number(o.count) || 0), 0);
  const cancelledOrders = orderBreakdown
    .filter((o: any) => o.status === 'CANCELLED')
    .reduce((sum: number, o: any) => sum + (Number(o.count) || 0), 0);

  // Derive auction breakdown
  const aStats = auctionStats.data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, {user?.firstName || user?.name || 'Admin'}. Here's your platform overview.
          </p>
        </div>
        <button
          onClick={() => {
            dashboard.refetch();
            revenue.refetch();
            topProducts.refetch();
            userGrowth.refetch();
            orderStats.refetch();
            auctionStats.refetch();
            recentActivity.refetch();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition-colors"
        >
          <RefreshCw size={16} className={dashboard.isFetching ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Error banner */}
      {errorMsg && !isLoading && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center justify-between">
          <span>{errorMsg}</span>
          <button
            onClick={() => dashboard.refetch()}
            className="px-3 py-1 bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 rounded-lg text-xs font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* ─── KPI Cards Row 1: Users ──────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.users.total ?? 0}
          subtitle="All registered users"
          icon={Users}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
          loading={isLoading}
          onClick={() => navigate('/admin/users')}
        />
        <StatCard
          title="Total Farmers"
          value={stats?.users.farmers ?? 0}
          subtitle="Verified farmers"
          icon={Tractor}
          iconColor="text-green-400"
          iconBg="bg-green-500/10"
          loading={isLoading}
          onClick={() => navigate('/admin/farmers')}
        />
        <StatCard
          title="Total Buyers"
          value={stats?.users.buyers ?? 0}
          subtitle="Registered buyers"
          icon={Users}
          iconColor="text-cyan-400"
          iconBg="bg-cyan-500/10"
          loading={isLoading}
          onClick={() => navigate('/admin/users/buyers')}
        />
        <StatCard
          title="Total Admins"
          value={stats?.users.admins ?? 0}
          subtitle="System administrators"
          icon={ShieldCheck}
          iconColor="text-red-400"
          iconBg="bg-red-500/10"
          loading={isLoading}
          onClick={() => navigate('/admin/users/admins')}
        />
      </div>

      {/* ─── KPI Cards Row 2: Catalog & Commerce ──────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <StatCard
          title="Products"
          value={stats?.products ?? 0}
          subtitle="Listed products"
          icon={Package}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
          loading={isLoading}
          onClick={() => navigate('/admin/products')}
        />
        <StatCard
          title="Categories"
          value={stats?.categories ?? 0}
          subtitle="Product categories"
          icon={Tag}
          iconColor="text-orange-400"
          iconBg="bg-orange-500/10"
          loading={isLoading}
          onClick={() => navigate('/admin/categories')}
        />
        <StatCard
          title="Orders"
          value={stats?.orders ?? 0}
          subtitle="Total platform orders"
          icon={ShoppingCart}
          iconColor="text-yellow-400"
          iconBg="bg-yellow-500/10"
          loading={isLoading}
          onClick={() => navigate('/admin/orders')}
        />
        <StatCard
          title="Auctions"
          value={stats?.auctions ?? 0}
          subtitle="Live and closed auctions"
          icon={Gavel}
          iconColor="text-pink-400"
          iconBg="bg-pink-500/10"
          loading={isLoading}
          onClick={() => navigate('/admin/auctions')}
        />
      </div>

      {/* ─── KPI Cards Row 3: Payments & Engagement ────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <StatCard
          title="Payments"
          value={stats?.payments ?? 0}
          subtitle="Processed payments"
          icon={CreditCard}
          iconColor="text-violet-400"
          iconBg="bg-violet-500/10"
          loading={isLoading}
          onClick={() => navigate('/admin/payments')}
        />
        <StatCard
          title="Reviews"
          value={stats?.reviews ?? 0}
          subtitle="Customer reviews"
          icon={Star}
          iconColor="text-yellow-400"
          iconBg="bg-yellow-500/10"
          loading={isLoading}
          onClick={() => navigate('/admin/reviews')}
        />
        <StatCard
          title="Notifications"
          value={stats?.notifications ?? 0}
          subtitle="System notifications"
          icon={Bell}
          iconColor="text-cyan-400"
          iconBg="bg-cyan-500/10"
          loading={isLoading}
          onClick={() => navigate('/admin/notifications')}
        />
        <StatCard
          title="Revenue"
          value={stats ? `₹${stats.revenue.toLocaleString()}` : '₹0'}
          subtitle="Total platform revenue"
          icon={TrendingUp}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          loading={isLoading}
          onClick={() => navigate('/admin/payments')}
        />
      </div>

      {/* ─── Charts Row 1 ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart
          data={revenue.data || []}
          loading={revenue.isLoading}
          error={revenue.error ? 'Failed to load revenue data' : null}
          onRetry={() => revenue.refetch()}
        />
        <OrderStatusChart
          data={orderStats.data || []}
          loading={orderStats.isLoading}
          error={orderStats.error ? 'Failed to load order stats' : null}
          onRetry={() => orderStats.refetch()}
        />
      </div>

      {/* ─── Charts Row 2 ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserGrowthChart
          data={userGrowth.data || []}
          loading={userGrowth.isLoading}
          error={userGrowth.error ? 'Failed to load user growth' : null}
          onRetry={() => userGrowth.refetch()}
        />
        <AuctionChart
          data={aStats || { live: 0, closed: 0, cancelled: 0, totalBids: 0, totalBidVolume: 0 }}
          loading={auctionStats.isLoading}
          error={auctionStats.error ? 'Failed to load auction stats' : null}
          onRetry={() => auctionStats.refetch()}
        />
      </div>

      {/* ─── Charts Row 3 + Activity ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsChart
          data={topProducts.data || []}
          loading={topProducts.isLoading}
          error={topProducts.error ? 'Failed to load top products' : null}
          onRetry={() => topProducts.refetch()}
        />
        <RecentActivity
          activities={recentActivity.data || []}
          loading={recentActivity.isLoading}
          error={recentActivity.error ? 'Failed to load recent activity' : null}
          onRetry={() => recentActivity.refetch()}
        />
      </div>
    </div>
  );
}
