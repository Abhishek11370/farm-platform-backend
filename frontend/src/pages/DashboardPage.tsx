import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userApi } from '../api/user.api';
import { orderApi } from '../api/order.api';
import { productApi } from '../api/product.api';
import { activityApi } from '../api/activity.api';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeFarms: 0,
    ordersToday: 0,
    revenue: 0,
  });
  
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all necessary data from the backend APIs
        const [usersData, ordersData, activitiesData] = await Promise.all([
          userApi.getUsers().catch(() => []),
          orderApi.getOrders().catch(() => []),
          activityApi.getActivities().catch(() => [])
        ]);

        const users = Array.isArray(usersData) ? usersData : usersData.data || [];
        const orders = Array.isArray(ordersData) ? ordersData : ordersData.data || [];
        const activities = Array.isArray(activitiesData) ? activitiesData : activitiesData.data || [];

        // Compute metrics
        const totalUsers = users.length;
        const activeFarms = users.filter((u: any) => u.role === 'FARMER').length;
        
        // Orders today could be derived from createdAt field, for now just total orders
        const ordersToday = orders.length;
        
        // Compute revenue
        const revenue = orders.reduce((sum: number, order: any) => sum + (Number(order.totalAmount) || 0), 0);

        setMetrics({
          totalUsers,
          activeFarms,
          ordersToday,
          revenue,
        });
        
        setRecentActivity(activities.slice(0, 5)); // show latest 5
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Failed to load real-time data from backend.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { title: "Total Users", value: metrics.totalUsers, trend: "Live" },
    { title: "Active Farms", value: metrics.activeFarms, trend: "Live" },
    { title: "Total Orders", value: metrics.ordersToday, trend: "Live" },
    { title: "Revenue", value: `$${metrics.revenue.toLocaleString()}`, trend: "Live" }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-1/3 bg-gray-800 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-800 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg shadow-green-500/30 transition-all font-medium">
          Generate Report
        </button>
      </div>
      
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 shadow-xl hover:bg-white/10 transition-all"
          >
            <h3 className="text-gray-400 font-medium text-sm">{stat.title}</h3>
            <div className="mt-2 flex justify-between items-end">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <span className="text-green-400 font-semibold text-sm bg-green-400/10 px-2 py-1 rounded-md">{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 shadow-xl min-h-[300px]"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity (Live)</h2>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-gray-400 text-sm">No recent activity from backend.</p>
            ) : (
              recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">#</div>
                    <div>
                      <p className="text-white font-medium">{activity.action || `Activity #${activity.id}`}</p>
                      <p className="text-gray-400 text-sm">{activity.details || 'System event'}</p>
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm">Just now</span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 shadow-xl min-h-[300px]"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            <button className="p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-700/50 transition-all text-left group">
              <h3 className="text-white font-medium group-hover:text-green-400 transition-colors">Add New Product</h3>
              <p className="text-gray-400 text-sm mt-1">List a new item in the marketplace</p>
            </button>
            <button className="p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-700/50 transition-all text-left group">
              <h3 className="text-white font-medium group-hover:text-green-400 transition-colors">Manage Farmers</h3>
              <p className="text-gray-400 text-sm mt-1">View and approve new registrations</p>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
