import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { useUsers } from '../hooks/useUsers';
import { Bell, Search, Send, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { notifications, sendNotification, deleteNotification } = useNotifications(true, page, 50);
  const { users } = useUsers(); // For dropdown when sending

  const [searchTerm, setSearchTerm] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    title: '',
    message: '',
    type: 'SYSTEM_ALERT' as const
  });

  const rawData = notifications.data;
  const notificationsList = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.notifications)
    ? rawData.notifications
    : Array.isArray(rawData?.data)
    ? rawData.data
    : [];
  
  const filteredNotifs = notificationsList.filter((notif: any) => 
    notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notif.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notif.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendNotification.mutateAsync(formData);
      setIsSending(false);
      setFormData({ userId: '', title: '', message: '', type: 'SYSTEM_ALERT' });
    } catch (e) {
      console.error('Failed to send', e);
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'ORDER_UPDATE': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'PAYMENT': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'SYSTEM_ALERT': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'PROMOTIONAL': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="text-green-600 dark:text-green-500" />
            System Notifications
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Broadcast messages and monitor system alerts.
          </p>
        </div>
        <button
          onClick={() => setIsSending(!isSending)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors shadow-sm shadow-green-500/20"
        >
          <Send size={18} />
          {isSending ? 'Cancel' : 'Send Notification'}
        </button>
      </div>

      {isSending && (
        <form onSubmit={handleSend} className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end backdrop-blur-sm">
          <div className="space-y-1 lg:col-span-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Recipient</label>
            <select
              required
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 dark:text-white"
            >
              <option value="">Select User...</option>
              {users.data?.map((u: any) => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>
          <div className="space-y-1 lg:col-span-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 dark:text-white"
            >
              <option value="SYSTEM_ALERT">System Alert</option>
              <option value="PROMOTIONAL">Promotional</option>
              <option value="ORDER_UPDATE">Order Update</option>
              <option value="PAYMENT">Payment</option>
            </select>
          </div>
          <div className="space-y-1 lg:col-span-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 dark:text-white"
            />
          </div>
          <div className="space-y-1 lg:col-span-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
            <input
              type="text"
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 dark:text-white"
            />
          </div>
          <div className="lg:col-span-1">
            <button
              type="submit"
              disabled={sendNotification.isPending}
              className="w-full py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {sendNotification.isPending ? 'Sending...' : 'Send Now'}
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
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-sm">
        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
          {notifications.isLoading ? (
            <li className="px-6 py-12 text-center text-gray-500">
              <div className="flex justify-center items-center gap-3">
                <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                Loading logs...
              </div>
            </li>
          ) : filteredNotifs.length === 0 ? (
            <li className="px-6 py-12 text-center text-gray-500">
              No notifications found.
            </li>
          ) : (
            filteredNotifs.map((notif: any) => (
              <li key={notif.id} className="p-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {notif.isRead ? (
                    <CheckCircle2 size={24} className="text-gray-400" />
                  ) : (
                    <AlertCircle size={24} className="text-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <p className={`text-sm font-medium ${notif.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                      {notif.title}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(notif.type)}`}>
                      {notif.type}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${notif.isRead ? 'text-gray-500 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    {notif.message}
                  </p>
                  <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2">
                    <span>{format(new Date(notif.createdAt), 'MMM d, yyyy h:mm a')}</span>
                    <span>•</span>
                    <span>To: {notif.user?.name || 'Unknown User'}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if(window.confirm('Delete this notification?')) deleteNotification.mutate(notif.id);
                  }}
                  className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
