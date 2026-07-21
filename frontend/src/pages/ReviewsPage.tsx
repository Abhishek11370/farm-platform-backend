import React, { useState } from 'react';
import { useReviews } from '../hooks/useReviews';
import { useProducts } from '../hooks/useProducts';
import { Star, MessageSquare, Trash2, Search, Download, CheckSquare, Square } from 'lucide-react';
import { format } from 'date-fns';

export default function ReviewsPage() {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  
  const { products } = useProducts({ page: 1, limit: 100 }); // Fetch products for the dropdown
  const { productReviews, allReviews, deleteReview } = useReviews(selectedProductId, page, 20);

  const activeReviews = selectedProductId ? productReviews : allReviews;
  const reviewsList = activeReviews.data?.data || [];
  const totalReviews = activeReviews.data?.total || 0;

  const filteredReviews = reviewsList.filter((review: any) => 
    review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedReviews(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedReviews.length} reviews?`)) return;
    for (const id of selectedReviews) {
      try {
        await deleteReview.mutateAsync(id);
      } catch (e) {
        console.error("Failed to delete", id);
      }
    }
    setSelectedReviews([]);
  };

  const exportCSV = () => {
    if (!filteredReviews.length) return;
    const headers = ['ID,User,Rating,Comment,Date'];
    const rows = filteredReviews.map((r: any) => 
      `${r.id},"${r.user?.name || 'Unknown'}",${r.rating},"${r.comment?.replace(/"/g, '""') || ''}",${r.createdAt}`
    );
    const csv = headers.concat(rows).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reviews-${selectedProductId || 'export'}.csv`;
    a.click();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill={i < rating ? "currentColor" : "none"} className={i < rating ? "" : "text-gray-300 dark:text-gray-600"} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="text-green-600 dark:text-green-500" />
            Reviews & Ratings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monitor product feedback and manage customer reviews.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedReviews.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
            >
              <Trash2 size={18} />
              Delete ({selectedReviews.length})
            </button>
          )}
          <button
            onClick={exportCSV}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-sm">
        <div className="w-full md:w-1/3">
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          >
            <option value="">Select a Product to view reviews...</option>
            {products.data?.map((p: any) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
        <div className="relative w-full md:w-2/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search reviews by comment or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  <button onClick={() => setSelectedReviews(filteredReviews.map((r: any) => r.id))} className="text-gray-400 hover:text-green-600">
                    {selectedReviews.length === filteredReviews.length && filteredReviews.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Comment</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-transparent">
              {activeReviews.isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-3">
                      <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                      Loading reviews...
                    </div>
                  </td>
                </tr>
                ) : filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No reviews found for this product.
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((review: any) => (
                    <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button onClick={() => toggleSelect(review.id)} className="text-gray-400 hover:text-green-600">
                          {selectedReviews.includes(review.id) ? <CheckSquare size={18} className="text-green-600" /> : <Square size={18} />}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {review.user?.name || review.buyer?.name || 'Anonymous'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {review.product?.title || 'Unknown Product'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStars(review.rating)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-md truncate">
                        {review.comment || <span className="text-gray-400 italic">No comment provided</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(review.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            if(window.confirm('Delete this review?')) deleteReview.mutate(review.id);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                          title="Delete Review"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}
