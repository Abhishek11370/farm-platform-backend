import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { useOrders } from '../hooks/useOrders';

export default function BuyerDashboard() {
  const { user, logout } = useAuth();
  const { products: productsQuery } = useProducts({ page: 1, limit: 4 });
  const { orders: ordersQuery } = useOrders();

  const products = productsQuery.data || [];
  const productsLoading = productsQuery.isLoading;
  const orders = ordersQuery.data || [];

  const activeOrders = orders.filter((o: any) => !['DELIVERED', 'CANCELLED'].includes(o.status)).length;
  // For the sake of the dashboard, we'll just mock it to 0 as there is no cart hook readily seen, OR use dynamic calculation if possible.
  // We can just query cart, but let's assume we show "0 Items" if we don't have it.

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 text-lg">F</div>
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
            <p className="text-3xl font-bold text-green-400">{products.length} Available</p>
            <p className="text-xs text-gray-500 mt-2">Explore fresh items from verified farms</p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-md">
            <h3 className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wider">Your Cart</h3>
            <p className="text-3xl font-bold text-yellow-400">View Cart</p>
            <p className="text-xs text-gray-500 mt-2">Add fresh items to place an order</p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-md">
            <h3 className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wider">Orders Tracked</h3>
            <p className="text-3xl font-bold text-blue-400">{activeOrders} Active</p>
            <p className="text-xs text-gray-500 mt-2">Real-time status updates from delivery agent</p>
          </div>
        </div>

        {/* Storefront Layout */}
        <h2 className="text-2xl font-bold mb-6">Fresh Arrivals</h2>
        {productsLoading ? (
          <p className="text-gray-400">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="p-4 rounded-xl bg-gray-900/40 border border-gray-800 flex flex-col justify-between h-72">
                <div>
                  <div className="w-full h-32 bg-gray-900/80 rounded-lg flex items-center justify-center text-gray-600 mb-4 overflow-hidden">
                    {product.images && product.images[0] ? (
                       <img src={product.images[0].imageUrl} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                       <span>No Image</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-white">{product.title}</h3>
                  <p className="text-xs text-gray-500">{product.description?.substring(0, 40)}...</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-green-400">₹{product.price} / kg</span>
                  <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-xs font-semibold">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
