import React from 'react';
import { Clock } from 'lucide-react';
import type { ActivityLog } from '../../types/analytics';

interface RecentActivityProps {
  activities: ActivityLog[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diff = Math.max(0, now - then);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function ActivitySkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-xl bg-gray-100 dark:bg-gray-800/60">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
}

const entityColors: Record<string, string> = {
  user: 'bg-blue-500/10 text-blue-400',
  product: 'bg-green-500/10 text-green-400',
  order: 'bg-yellow-500/10 text-yellow-400',
  payment: 'bg-purple-500/10 text-purple-400',
  auction: 'bg-pink-500/10 text-pink-400',
  notification: 'bg-cyan-500/10 text-cyan-400',
};

export default function RecentActivity({ activities, loading, error, onRetry }: RecentActivityProps) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        <Clock size={18} className="text-gray-400" />
      </div>

      {loading ? (
        <ActivitySkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          <p className="text-sm text-red-400">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-500">
          <Clock size={32} className="opacity-40" />
          <p className="text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {activities.slice(0, 15).map((activity) => {
            const colorClass = entityColors[activity.entity?.toLowerCase()] || 'bg-gray-500/10 text-gray-400';
            return (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${colorClass}`}>
                  {activity.entity?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-gray-200 truncate">
                    <span className="font-medium">{activity.action}</span>
                    {activity.details && (
                      <span className="text-gray-500 dark:text-gray-400"> — {activity.details}</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.user?.name || activity.user?.email || 'System'} · {activity.entity}
                  </p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono whitespace-nowrap">
                  {timeAgo(activity.createdAt)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
