import React, { useState } from 'react';
import { useDelivery } from '../hooks/useDelivery';
import { useUsers } from '../hooks/useUsers';
import { useOrders } from '../hooks/useOrders';
import { Truck, Search, MapPin, CheckCircle2, Clock, Map, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function DeliveryPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { deliveries, assignDelivery } = useDelivery({ page, limit: 20, status: statusFilter || undefined });
  const { users } = useUsers(); // For finding delivery agents
  const { orders } = useOrders(); // For finding unassigned orders

  const [isAssigning, setIsAssigning] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    agentId: '',
    pickupAddr: ''
  });

  const deliveryAgents = users.data?.filter((u: any) => u.role === 'DELIVERY') || [];
  const availableOrders = orders.data?.filter((o: any) => o.status === 'CONFIRMED' || o.status === 'PROCESSING') || [];

  const rawDeliveries = deliveries.data;
  const deliveryList = Array.isArray(rawDeliveries) ? rawDeliveries : Array.isArray(rawDeliveries?.data) ? rawDeliveries.data : [];
  
  const filteredDeliveries = deliveryList.filter((d: any) => 
    d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await assignDelivery.mutateAsync(formData);
      setIsAssigning(false);
      setFormData({ orderId: '', agentId: '', pickupAddr: '' });
    } catch (error) {
      console.error('Failed to assign delivery', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'IN_TRANSIT': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Truck className="text-green-600 dark:text-green-500" />
            Delivery Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Assign agents, track locations, and manage logistics.
          </p>
        </div>
        <button
          onClick={() => setIsAssigning(!isAssigning)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors shadow-sm shadow-green-500/20"
        >
          <MapPin size={18} />
          {isAssigning ? 'Cancel Assignment' : 'Assign Delivery'}
        </button>
      </div>

      {isAssigning && (
        <form onSubmit={handleAssign} className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 items-end backdrop-blur-sm">
          <div className="space-y-1 md:col-span-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Order ID</label>
            <select
              required
              value={formData.orderId}
              onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 dark:text-white"
            >
              <option value="">Select Order...</option>
              {availableOrders.map((o: any) => (
                <option key={o.id} value={o.id}>Order #{o.id.slice(0, 8)} - ₹{o.totalAmount}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1 md:col-span-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Agent</label>
            <select
              required
              value={formData.agentId}
              onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 dark:text-white"
            >
              <option value="">Select Agent...</option>
              {deliveryAgents.map((a: any) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1 md:col-span-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pickup Address</label>
            <input
              type="text"
              required
              value={formData.pickupAddr}
              onChange={(e) => setFormData({ ...formData, pickupAddr: e.target.value })}
              placeholder="Farm or Warehouse address"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 dark:text-white"
            />
          </div>
          <div className="md:col-span-1">
            <button
              type="submit"
              disabled={assignDelivery.isPending}
              className="w-full py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {assignDelivery.isPending ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-sm">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by Delivery ID or Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block w-full md:w-48 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="DELIVERED">Delivered</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery ID</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Agent</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tracking</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-transparent">
              {deliveries.isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-3">
                      <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                      Loading deliveries...
                    </div>
                  </td>
                </tr>
              ) : filteredDeliveries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No deliveries found.
                  </td>
                </tr>
              ) : (
                filteredDeliveries.map((delivery: any) => (
                  <tr key={delivery.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-300">
                      #{delivery.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">
                      #{delivery.orderId.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {delivery.agent?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                        {delivery.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {delivery.currentLat && delivery.currentLng ? (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-500">
                          <Map size={14} /> Available
                        </div>
                      ) : (
                        <span className="text-gray-400">Not tracked yet</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {delivery.createdAt ? format(new Date(delivery.createdAt), 'MMM d, yyyy') : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
