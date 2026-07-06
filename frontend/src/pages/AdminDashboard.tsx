import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-green-500/20 text-lg">F</div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Farm Platform</span>
          <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 border border-red-500/30 text-red-400 font-semibold font-mono ml-2">ADMIN</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{user?.email}</span>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-all"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8">Admin Dashboard</h1>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-md">
            <h3 className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wider">User Management</h3>
            <p className="text-3xl font-bold text-green-400">Active</p>
            <p className="text-xs text-gray-500 mt-2">Manage farmers, buyers and delivery agents</p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-md">
            <h3 className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wider">Products & Verifications</h3>
            <p className="text-3xl font-bold text-yellow-400">Pending Review</p>
            <p className="text-xs text-gray-500 mt-2">Approve new listings and grade certifications</p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-md">
            <h3 className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wider">Analytics & Logs</h3>
            <p className="text-3xl font-bold text-blue-400">All Systems Nominal</p>
            <p className="text-xs text-gray-500 mt-2">Platform transaction audit history logs</p>
          </div>
        </div>

        {/* Dashboard Placeholder Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-gray-900/40 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Platform Overview</h2>
            <div className="h-64 bg-gray-900/80 rounded-xl border border-gray-800/80 flex items-center justify-center text-gray-500 font-mono text-sm">
              [Analytics Data Chart Visualization placeholder]
            </div>
          </div>
          <div className="p-8 rounded-2xl bg-gray-900/40 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Recent Audit Actions</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800/60 flex justify-between items-center text-sm">
                <span>Verified Grade A Wheat Batch #1024</span>
                <span className="text-xs text-gray-500 font-mono">10 mins ago</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800/60 flex justify-between items-center text-sm">
                <span>Registered new Farmer: Ramesh Kumar</span>
                <span className="text-xs text-gray-500 font-mono">1 hr ago</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800/60 flex justify-between items-center text-sm">
                <span>Database Backup completed successfully</span>
                <span className="text-xs text-gray-500 font-mono">4 hrs ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
