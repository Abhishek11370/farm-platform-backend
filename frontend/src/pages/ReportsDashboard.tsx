import React, { useState } from 'react';
import { useReports } from '../hooks/useReports';
import { FileText, TrendingUp, Users, ShoppingCart, DollarSign, Download, Filter } from 'lucide-react';

export default function ReportsDashboard() {
  const { revenueTimeline, topProducts, userGrowth, orderStats } = useReports();
  const [activeTab, setActiveTab] = useState<'sales'|'revenue'|'products'|'farmers'|'orders'>('sales');

  const tabs = [
    { id: 'sales', name: 'Sales & Revenue', icon: DollarSign },
    { id: 'products', name: 'Product Performance', icon: ShoppingCart },
    { id: 'farmers', name: 'User Growth', icon: Users },
    { id: 'orders', name: 'Order Metrics', icon: FileText },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Exportable insights and tabular data for the platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
            <Filter size={18} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 overflow-x-auto no-scrollbar pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Icon size={18} />
              {tab.name}
            </button>
          )
        })}
      </div>

      {activeTab === 'sales' && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Daily Revenue (₹)</th>
              </tr>
            </thead>
            <tbody>
              {revenueTimeline.data?.map((item: any) => (
                <tr key={item.date} className="border-b border-gray-200 dark:border-gray-800">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.date}</td>
                  <td className="px-6 py-4 text-right text-green-600 font-medium">₹{item.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Farmer/Owner</th>
                <th className="px-6 py-4 text-right">Units Sold</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.data?.map((item: any) => (
                <tr key={item.product?.id} className="border-b border-gray-200 dark:border-gray-800">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                    <img src={item.product?.images?.[0]?.imageUrl || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    {item.product?.title}
                  </td>
                  <td className="px-6 py-4">{item.product?.owner?.name}</td>
                  <td className="px-6 py-4 text-right font-medium">{item.totalQuantitySold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'farmers' && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Month</th>
                <th className="px-6 py-4 text-right">New Farmers</th>
                <th className="px-6 py-4 text-right">New Buyers</th>
              </tr>
            </thead>
            <tbody>
              {userGrowth.data?.map((item: any) => (
                <tr key={item.month} className="border-b border-gray-200 dark:border-gray-800">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.month}</td>
                  <td className="px-6 py-4 text-right font-medium">{item.farmers}</td>
                  <td className="px-6 py-4 text-right font-medium">{item.buyers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Order Status</th>
                <th className="px-6 py-4 text-right">Total Orders</th>
              </tr>
            </thead>
            <tbody>
              {orderStats.data?.map((item: any) => (
                <tr key={item.status} className="border-b border-gray-200 dark:border-gray-800">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.status}</td>
                  <td className="px-6 py-4 text-right font-medium">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
