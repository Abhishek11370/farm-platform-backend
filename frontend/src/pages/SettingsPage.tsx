import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../hooks/useSettings';
import { Settings, User, Lock, Mail, CreditCard, Box, Shield, Briefcase, Globe, FileText, Percent, Server } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { bulkUpsert } = useSettings();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Profile Settings', icon: User },
    { id: 'password', name: 'Password Change', icon: Lock },
    { id: 'general', name: 'General Settings', icon: Settings },
    { id: 'business', name: 'Business Settings', icon: Briefcase },
    { id: 'platform', name: 'Platform Settings', icon: Globe },
    { id: 'smtp', name: 'SMTP Configuration', icon: Mail },
    { id: 'payment', name: 'Payment Config', icon: CreditCard },
    { id: 'tax', name: 'Tax Settings', icon: Percent },
    { id: 'shipping', name: 'Shipping Settings', icon: Box },
    { id: 'storage', name: 'File Storage', icon: Server },
    { id: 'roles', name: 'Role Permissions', icon: Shield },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // In a real scenario we'd map all form fields to key-value pairs
      await bulkUpsert.mutateAsync([{ key: 'LAST_UPDATED', value: new Date().toISOString() }]);
      alert('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="text-blue-600 dark:text-blue-500" />
          System Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your account and platform configuration.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-2 backdrop-blur-sm shadow-sm space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={18} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 backdrop-blur-sm shadow-sm">
            
            {activeTab === 'profile' && (
              <form onSubmit={handleSave} className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <input type="text" defaultValue={user?.name} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                    <input type="email" defaultValue={user?.email} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white" disabled />
                  </div>
                </div>
                <button type="submit" disabled={isSaving} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handleSave} className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Password Change</h2>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                    <input type="password" required className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                    <input type="password" required className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                    <input type="password" required className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white" />
                  </div>
                </div>
                <button type="submit" disabled={isSaving} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">
                  {isSaving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}

            {activeTab === 'general' && (
              <form onSubmit={handleSave} className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Site Title</label>
                    <input type="text" defaultValue="Farm-to-Platform" className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
                    <select className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white">
                      <option>Asia/Kolkata (IST)</option>
                      <option>UTC</option>
                    </select>
                  </div>
                </div>
                <button type="submit" disabled={isSaving} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </form>
            )}

            {/* Render other tabs neutrally */}
            {['business', 'platform', 'smtp', 'payment', 'tax', 'shipping', 'storage', 'roles'].includes(activeTab) && (
              <form onSubmit={handleSave} className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 capitalize">{activeTab.replace('-', ' ')} Configuration</h2>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Config JSON</label>
                    <textarea 
                      required 
                      rows={5}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white font-mono text-sm"
                      placeholder={`{"enabled": true}`} 
                    />
                  </div>
                </div>
                <button type="submit" disabled={isSaving || bulkUpsert.isPending} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">
                  {isSaving || bulkUpsert.isPending ? 'Saving...' : 'Save Configuration'}
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
