import React, { useState } from 'react';
import { useCoupons } from '../hooks/useCoupons';
import { Ticket, Search, Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function CouponsPage() {
  const [page, setPage] = useState(1);
  const { coupons, createCoupon, toggleCoupon, deleteCoupon } = useCoupons(page, 20);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountPercent: 10,
    maxUsage: 100,
    expiresAt: '',
    minOrderAmount: 0
  });

  const rawCoupons = coupons.data;
  const couponsList = Array.isArray(rawCoupons) 
    ? rawCoupons 
    : Array.isArray(rawCoupons?.coupons)
    ? rawCoupons.coupons
    : Array.isArray(rawCoupons?.data)
    ? rawCoupons.data
    : [];
  
  const filteredCoupons = couponsList.filter((coupon: any) => 
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCoupon.mutateAsync({
        ...formData,
        expiresAt: new Date(formData.expiresAt).toISOString()
      });
      setIsAdding(false);
      setFormData({
        code: '',
        discountPercent: 10,
        maxUsage: 100,
        expiresAt: '',
        minOrderAmount: 0
      });
    } catch (error) {
      console.error('Failed to create coupon', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Ticket className="text-green-600 dark:text-green-500" />
            Coupons & Offers
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage discount codes, track usage, and monitor active offers.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors shadow-sm shadow-green-500/20"
        >
          <Plus size={18} />
          {isAdding ? 'Cancel' : 'Create Coupon'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end backdrop-blur-sm">
          <div className="space-y-1 lg:col-span-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Code</label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. SUMMER20"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 dark:text-white uppercase"
            />
          </div>
          <div className="space-y-1 lg:col-span-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Discount %</label>
            <input
              type="number"
              required
              min="1"
              max="100"
              value={formData.discountPercent}
              onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 dark:text-white"
            />
          </div>
          <div className="space-y-1 lg:col-span-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Max Uses</label>
            <input
              type="number"
              required
              min="1"
              value={formData.maxUsage}
              onChange={(e) => setFormData({ ...formData, maxUsage: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 dark:text-white"
            />
          </div>
          <div className="space-y-1 lg:col-span-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Min Order ₹</label>
            <input
              type="number"
              required
              min="0"
              value={formData.minOrderAmount}
              onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 dark:text-white"
            />
          </div>
          <div className="space-y-1 lg:col-span-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Expiry Date</label>
            <input
              type="datetime-local"
              required
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 dark:text-white"
            />
          </div>
          <div className="lg:col-span-1">
            <button
              type="submit"
              disabled={createCoupon.isPending}
              className="w-full py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {createCoupon.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex items-center justify-between backdrop-blur-sm">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.isLoading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse h-48 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800" />
          ))
        ) : filteredCoupons.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
            No coupons found.
          </div>
        ) : (
          filteredCoupons.map((coupon: any) => (
            <div key={coupon.id} className={`bg-white dark:bg-gray-900 border rounded-2xl overflow-hidden transition-all ${coupon.isActive ? 'border-green-200 dark:border-green-900/50 shadow-sm shadow-green-500/5' : 'border-gray-200 dark:border-gray-800 opacity-75'}`}>
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-mono font-bold text-xl text-gray-900 dark:text-white tracking-wider">
                      {coupon.code}
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-500 font-semibold mt-1">
                      {coupon.discountPercent}% OFF
                    </p>
                  </div>
                  <button
                    onClick={() => toggleCoupon.mutate({ id: coupon.id, isActive: !coupon.isActive })}
                    className={`p-1 rounded-lg transition-colors ${coupon.isActive ? 'text-green-600 bg-green-100 dark:bg-green-900/30' : 'text-gray-400 bg-gray-100 dark:bg-gray-800'}`}
                    title={coupon.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {coupon.isActive ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                  </button>
                </div>

                <div className="space-y-2 mt-4 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Usage:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {coupon.currentUsage} / {coupon.maxUsage}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-green-500 h-1.5 rounded-full" 
                      style={{ width: `${Math.min(100, (coupon.currentUsage / coupon.maxUsage) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400 pt-2">
                    <span>Min Order:</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹{coupon.minOrderAmount}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Expires:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {coupon.expiresAt ? format(new Date(coupon.expiresAt), 'MMM d, yyyy') : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <button
                  onClick={() => {
                    if(window.confirm('Are you sure you want to delete this coupon?')) {
                      deleteCoupon.mutate(coupon.id);
                    }
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                  title="Delete Coupon"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
