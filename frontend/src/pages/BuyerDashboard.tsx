import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function BuyerDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-green-500/20 text-lg">F</div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Farm Platform</span>
          <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 border border-blue-500/30 text-blue-400 font-semibold font-mono ml-2">BUYER</span>
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
        <h1 className="text-4xl font-extrabold tracking-tight mb-8">Storefront</h1>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-md">
            <h3 className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wider">Browse Produce</h3>
            <p className="text-3xl font-bold text-green-400">Available</p>
            <p className="text-xs text-gray-500 mt-2">Explore fresh items from verified farms</p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-md">
            <h3 className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wider">Your Cart</h3>
            <p className="text-3xl font-bold text-yellow-400">Empty</p>
            <p className="text-xs text-gray-500 mt-2">Add fresh items to place an order</p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-md">
            <h3 className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wider">Orders Tracked</h3>
            <p className="text-3xl font-bold text-blue-400">0 Active</p>
            <p className="text-xs text-gray-500 mt-2">Real-time status updates from delivery agent</p>
          </div>
        </div>

        {/* Storefront Layout */}
        <h2 className="text-2xl font-bold mb-6">Fresh Arrivals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800 flex flex-col justify-between h-72">
            <div>
              <div className="w-full h-32 bg-gray-900/80 rounded-lg flex items-center justify-center text-gray-600 mb-4">[Image]</div>
              <h3 className="font-semibold text-lg text-white">Organic Basmati Rice</h3>
              <p className="text-xs text-gray-500">Karnal Golden Valley Farm</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="font-bold text-green-400">₹150 / kg</span>
              <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-xs font-semibold">Add to Cart</button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800 flex flex-col justify-between h-72">
            <div>
              <div className="w-full h-32 bg-gray-900/80 rounded-lg flex items-center justify-center text-gray-600 mb-4">[Image]</div>
              <h3 className="font-semibold text-lg text-white">Fresh Vine Tomatoes</h3>
              <p className="text-xs text-gray-500">Greenhouse Orchards</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="font-bold text-green-400">₹40 / kg</span>
              <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-xs font-semibold">Add to Cart</button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800 flex flex-col justify-between h-72">
            <div>
              <div className="w-full h-32 bg-gray-900/80 rounded-lg flex items-center justify-center text-gray-600 mb-4">[Image]</div>
              <h3 className="font-semibold text-lg text-white">Sweet Honey Crisp Apples</h3>
              <p className="text-xs text-gray-500">Shimla Premium Farms</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="font-bold text-green-400">₹180 / kg</span>
              <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-xs font-semibold">Add to Cart</button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800 flex flex-col justify-between h-72">
            <div>
              <div className="w-full h-32 bg-gray-900/80 rounded-lg flex items-center justify-center text-gray-600 mb-4">[Image]</div>
              <h3 className="font-semibold text-lg text-white">Yukon Gold Potatoes</h3>
              <p className="text-xs text-gray-500">Dehradun Agri Fields</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="font-bold text-green-400">₹30 / kg</span>
              <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-xs font-semibold">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
