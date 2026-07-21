// Status-filtered orders page — reuses useOrders hook with a status preset
import React, { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { ShoppingCart, Search, Clock, CheckCircle2, XCircle, Truck, Eye } from 'lucide-react';
import { format } from 'date-fns';

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';

interface FilteredOrdersPageProps {
  status?: OrderStatus;
  title: string;
  description: string;
  accentColor?: string;
}

function FilteredOrdersPage({ status, title, description, accentColor = 'text-green-600' }: FilteredOrdersPageProps) {
  const { orders, updateOrderStatus } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const itemsPerPage = 10;

  const filtered = (orders.data || []).filter((o: any) => {
    const matchesStatus = status ? o.status === status : true;
    const matchesSearch = o.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    CONFIRMED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    PROCESSING: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    PACKED: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    SHIPPED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    DELIVERED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    RETURNED: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };

  const nextStatuses: Record<string, string[]> = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['PACKED', 'CANCELLED'],
    PACKED: ['SHIPPED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: ['RETURNED'],
    CANCELLED: [],
    RETURNED: [],
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsUpdating(id);
    try {
      await updateOrderStatus.mutateAsync({ id, data: { status: newStatus } });
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2`}>
          <ShoppingCart className={accentColor} size={24} />
          {title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{filtered.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 mb-1">Revenue</p>
          <p className="text-2xl font-bold text-green-600">
            ₹{filtered.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <p className="text-xs text-gray-500 mb-1">Avg. Value</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹{filtered.length ? Math.round(filtered.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0) / filtered.length).toLocaleString() : 0}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {orders.isLoading ? (
          <div className="flex items-center justify-center h-48 text-gray-400">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
            <ShoppingCart size={32} className="opacity-30" />
            <p>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                  <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Order ID</th>
                  <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Customer</th>
                  <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Items</th>
                  <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                  <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((order: any) => (
                  <tr key={order.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                      #{order.id?.slice(-8)?.toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{order.user?.name || '—'}</p>
                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{order.items?.length || 0}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                      ₹{(order.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || ''}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {order.createdAt ? format(new Date(order.createdAt), 'MMM d, yyyy') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {(nextStatuses[order.status] || []).map((nextStatus: string) => (
                          <button
                            key={nextStatus}
                            disabled={isUpdating === order.id}
                            onClick={() => handleUpdateStatus(order.id, nextStatus)}
                            className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-300 hover:text-green-700 transition-colors disabled:opacity-50"
                          >
                            → {nextStatus}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500">Page {currentPage} of {totalPages}</p>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800">Prev</button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function PendingOrdersPage() {
  return <FilteredOrdersPage status="PENDING" title="Pending Orders" description="Orders awaiting confirmation." accentColor="text-yellow-600" />;
}

export function ConfirmedOrdersPage() {
  return <FilteredOrdersPage status="CONFIRMED" title="Confirmed Orders" description="Orders confirmed and awaiting processing." accentColor="text-blue-600" />;
}

export function ProcessingOrdersPage() {
  return <FilteredOrdersPage status="PROCESSING" title="Processing Orders" description="Orders currently being processed." accentColor="text-indigo-600" />;
}

export function PackedOrdersPage() {
  return <FilteredOrdersPage status="PACKED" title="Packed Orders" description="Orders packed and ready for shipping." accentColor="text-cyan-600" />;
}

export function ShippedOrdersPage() {
  return <FilteredOrdersPage status="SHIPPED" title="Shipped Orders" description="Orders currently in transit." accentColor="text-purple-600" />;
}

export function DeliveredOrdersPage() {
  return <FilteredOrdersPage status="DELIVERED" title="Delivered Orders" description="Successfully delivered orders." accentColor="text-green-600" />;
}

export function CancelledOrdersPage() {
  return <FilteredOrdersPage status="CANCELLED" title="Cancelled Orders" description="Orders that were cancelled." accentColor="text-red-600" />;
}

export function ReturnedOrdersPage() {
  return <FilteredOrdersPage status="RETURNED" title="Returned Orders" description="Orders returned by customers." accentColor="text-orange-600" />;
}

export default FilteredOrdersPage;
