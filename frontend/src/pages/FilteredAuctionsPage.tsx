import React, { useState } from 'react';
import { useAuctions } from '../hooks/useAuctions';
import { Gavel, Search, Clock, TrendingUp, Zap, Calendar } from 'lucide-react';
import { format } from 'date-fns';

type AuctionStatus = 'LIVE' | 'ACTIVE' | 'CLOSED' | 'COMPLETED' | 'CANCELLED' | 'UPCOMING' | 'DRAFT';

interface FilteredAuctionsPageProps {
  status: AuctionStatus;
  title: string;
  description: string;
}

function FilteredAuctionsPage({ status, title, description }: FilteredAuctionsPageProps) {
  const { auctions } = useAuctions();
  const [searchTerm, setSearchTerm] = useState('');

  const now = new Date();
  const filtered = (Array.isArray(auctions.data) ? auctions.data : []).filter((a: any) => {
    const matchesSearch = a.product?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    if (status === 'UPCOMING') {
      return matchesSearch && (a.status === 'LIVE' || a.status === 'ACTIVE') && new Date(a.startTime) > now;
    }
    if (status === 'LIVE') return matchesSearch && (a.status === 'LIVE' || a.status === 'ACTIVE');
    if (status === 'CLOSED') return matchesSearch && (a.status === 'CLOSED' || a.status === 'COMPLETED');
    return matchesSearch && a.status === status;
  });

  const getStatusBadge = (s: AuctionStatus) => {
    switch (s) {
      case 'ACTIVE': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'COMPLETED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'CANCELLED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'UPCOMING': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  const Icon = status === 'ACTIVE' ? Zap : status === 'UPCOMING' ? Calendar : Gavel;
  const iconColor = status === 'ACTIVE' ? 'text-green-600' : status === 'UPCOMING' ? 'text-yellow-600' : 'text-gray-500';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Icon className={iconColor} size={24} />
          {title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <span className="self-center text-sm text-gray-500">{filtered.length} auctions</span>
      </div>

      {auctions.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse h-56 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-400 gap-2">
          <Gavel size={32} className="opacity-30" />
          <p>No {title.toLowerCase()} found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((auction: any) => (
            <div key={auction.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{auction.product?.title || 'Unknown Product'}</h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(status)}`}>
                    {status === 'UPCOMING' ? 'UPCOMING' : auction.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Start Price</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹{auction.startingPrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1"><TrendingUp size={12} className="text-green-500" /> Highest Bid</span>
                    <span className="font-bold text-green-600">₹{(auction.highestBid || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1"><Clock size={12} /> End Time</span>
                    <span className="text-gray-700 dark:text-gray-300">{auction.endTime ? format(new Date(auction.endTime), 'MMM d, HH:mm') : '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function LiveAuctionsPage() {
  return <FilteredAuctionsPage status="LIVE" title="Live Auctions" description="Currently active auctions with open bidding." />;
}

export function UpcomingAuctionsPage() {
  return <FilteredAuctionsPage status="UPCOMING" title="Upcoming Auctions" description="Auctions scheduled to go live soon." />;
}

export function ClosedAuctionsPage() {
  return <FilteredAuctionsPage status="CLOSED" title="Closed Auctions" description="Completed auctions with final bids." />;
}

export default FilteredAuctionsPage;
