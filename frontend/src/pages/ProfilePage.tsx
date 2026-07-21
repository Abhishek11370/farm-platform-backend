import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Smartphone, MapPin } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account details and security settings.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-start">
        <div className="w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-500 shrink-0">
          <User size={64} />
        </div>
        
        <div className="flex-1 w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
              <div className="mt-1 flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                <User size={18} className="text-gray-400" />
                {user?.name || 'Administrator'}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
              <div className="mt-1 flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                <Mail size={18} className="text-gray-400" />
                {user?.email}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</label>
              <div className="mt-1 flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                <Shield size={18} className="text-gray-400" />
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {user?.role}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Created</label>
              <div className="mt-1 flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                <Calendar size={18} className="text-gray-400" />
                October 12, 2023
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
              <div className="mt-1 flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                <Smartphone size={18} className="text-gray-400" />
                +91 9876543210
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</label>
              <div className="mt-1 flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                <MapPin size={18} className="text-gray-400" />
                Mumbai, India
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex gap-4">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
            <button className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
