import React, { useState } from 'react';
import { useActivity } from '../hooks/useActivity';
import { Activity, Search, Filter, Clock, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function ActivityLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  
  const { activities } = useActivity(true); // true for admin view

  const logs = Array.isArray(activities.data) ? activities.data : [];

  const filteredLogs = logs.filter((log: any) => {
    const matchesSearch = 
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter ? log.action === actionFilter : true;
    
    return matchesSearch && matchesAction;
  });

  const getActionColor = (action: string) => {
    switch(action) {
      case 'CREATE': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'UPDATE': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'LOGIN': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const uniqueActions = Array.from(new Set(logs.map((l: any) => l.action).filter(Boolean)));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="text-blue-600 dark:text-blue-500" />
            System Activity Logs
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track user actions and system events.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-sm">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-gray-400" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="block w-full md:w-48 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="">All Actions</option>
            {uniqueActions.map((action: any) => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 backdrop-blur-sm shadow-sm">
        {activities.isLoading ? (
          <div className="flex justify-center items-center py-12 text-gray-500">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
            Loading activity logs...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No activity logs found.
          </div>
        ) : (
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              {filteredLogs.map((log: any, logIdx: number) => (
                <li key={log.id}>
                  <div className="relative pb-8">
                    {logIdx !== filteredLogs.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-800" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-900 ${getActionColor(log.action)}`}>
                          <ArrowRight size={14} className="transform rotate-45" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium text-gray-900 dark:text-white mr-1">
                              {log.user?.name || 'System'}
                            </span>
                            performed <span className="font-medium text-gray-900 dark:text-white mx-1">{log.action}</span> 
                            on <span className="font-medium text-gray-900 dark:text-white mx-1">{log.entity}</span>
                            {log.entityId && ` (#${log.entityId.slice(0,8)})`}
                          </p>
                          {log.details && (
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-500 italic bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg inline-block border border-gray-100 dark:border-gray-800">
                              {log.details}
                            </p>
                          )}
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400 flex flex-col items-end">
                          <time dateTime={log.createdAt} className="flex items-center gap-1">
                            <Clock size={12} />
                            {format(new Date(log.createdAt), 'MMM d, h:mm a')}
                          </time>
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                            <User size={10} />
                            {log.user?.role || 'SYSTEM'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
