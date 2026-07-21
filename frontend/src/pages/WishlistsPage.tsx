import React, { useState } from 'react';
import { useWishlists } from '../hooks/useWishlists';
import { Heart, Search, Trash2, ShoppingCart, Info, Download } from 'lucide-react';
import { format } from 'date-fns';

export default function WishlistsPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlists();
  const [searchTerm, setSearchTerm] = useState('');

  const wishlistItems = wishlist.data || [];
  
  const filteredItems = wishlistItems.filter((item: any) => 
    item.product?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportCSV = () => {
    if (!filteredItems.length) return;
    const headers = ['Product ID,Product Name,Price,Added Date'];
    const rows = filteredItems.map((item: any) => 
      `${item.product?.id},"${item.product?.title?.replace(/"/g, '""') || ''}",${item.product?.price},${item.createdAt}`
    );
    const csv = headers.concat(rows).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wishlist-export.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Heart className="text-red-500" fill="currentColor" />
            My Wishlist
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Keep track of products you want to purchase later.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {wishlistItems.length > 0 && (
            <button
              onClick={() => {
                if(window.confirm('Are you sure you want to clear your entire wishlist?')) {
                  clearWishlist.mutate();
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl font-medium transition-colors"
            >
              <Trash2 size={18} />
              Clear All
            </button>
          )}
          <button
            onClick={exportCSV}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex items-center justify-between backdrop-blur-sm">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search wishlist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse h-64 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800" />
          ))
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl backdrop-blur-sm">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Heart className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your wishlist is empty</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
              You haven't saved any products yet. Browse the catalog and click the heart icon to save items here.
            </p>
          </div>
        ) : (
          filteredItems.map((item: any) => (
            <div key={item.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group flex flex-col">
              <div className="relative h-48 bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                {item.product?.images && item.product.images.length > 0 ? (
                  <img src={item.product.images[0].url} alt={item.product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart className="text-gray-300 dark:text-gray-600" size={48} />
                  </div>
                )}
                <button
                  onClick={() => removeFromWishlist.mutate(item.product?.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-900/90 rounded-full text-red-500 hover:scale-110 transition-transform shadow-sm"
                  title="Remove from Wishlist"
                >
                  <Heart size={18} fill="currentColor" />
                </button>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-1 mb-1">
                  {item.product?.title || 'Unknown Product'}
                </h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-500 mb-3">
                  ₹{item.product?.price}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                  <button className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-2">
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                  <button className="p-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-300 transition-colors" title="Details">
                    <Info size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
