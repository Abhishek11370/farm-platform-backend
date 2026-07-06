import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function FarmerDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-green-500/20 text-lg">F</div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Farm Platform</span>
          <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 border border-green-500/30 text-green-400 font-semibold font-mono ml-2">FARMER</span>
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Farmer Portal</h1>
          <button className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg shadow-green-500/20 transition-all hover:-translate-y-0.5">
            + List New Produce
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-md">
            <h3 className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wider">Active Inventory</h3>
            <p className="text-3xl font-bold text-green-400">12 Crops</p>
            <p className="text-xs text-gray-500 mt-2">Wheat, Potatoes, Organic Rice, etc.</p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-md">
            <h3 className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wider">Orders to Ship</h3>
            <p className="text-3xl font-bold text-yellow-400">4 Pending</p>
            <p className="text-xs text-gray-500 mt-2">Awaiting logistics agent pickup</p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-md">
            <h3 className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wider">Total Earnings</h3>
            <p className="text-3xl font-bold text-blue-400">₹45,280</p>
            <p className="text-xs text-gray-500 mt-2">Payments processed & completed</p>
          </div>
        </div>

        {/* Dashboard Placeholder Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-gray-900/40 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Add/Update Product</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800/80">
                <p className="text-sm font-medium text-gray-300">Fast Add Panel</p>
                <div className="mt-3 flex gap-3">
                  <input type="text" placeholder="Product Name (e.g. Tomato)" className="bg-gray-950 border border-gray-800 rounded px-3 py-1.5 text-sm flex-1" />
                  <input type="text" placeholder="Price (per kg)" className="bg-gray-950 border border-gray-800 rounded px-3 py-1.5 text-sm w-28" />
                  <button className="px-3 bg-green-600 rounded text-xs font-semibold">Add</button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 rounded-2xl bg-gray-900/40 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Earnings History</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800/60 flex justify-between items-center text-sm">
                <span>Organic Basmati Rice (50kg)</span>
                <span className="font-semibold text-green-400">₹7,500</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800/60 flex justify-between items-center text-sm">
                <span>Grade A Potatoes (200kg)</span>
                <span className="font-semibold text-green-400">₹4,000</span>
              </div>
              <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800/60 flex justify-between items-center text-sm">
                <span>Sweet Onions (100kg)</span>
                <span className="font-semibold text-green-400">₹2,800</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
