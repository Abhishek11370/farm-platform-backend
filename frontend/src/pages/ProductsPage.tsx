import React, { useState } from 'react';
import { useProducts, useProductMetadata } from '../hooks/useProducts';
import { Product } from '../types/product';
import ProductModal from '../components/products/ProductModal';
import { 
  Package, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  MapPin, 
  Tag, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { products, createProduct, updateProduct, deleteProduct } = useProducts();
  const { subCategories } = useProductMetadata();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Filter products locally (backend supports query, but we can do a comprehensive search/filter locally)
  const rawProducts = Array.isArray(products.data) 
    ? products.data 
    : Array.isArray((products.data as any)?.data) 
      ? (products.data as any).data 
      : [];

  const filteredProducts = rawProducts.filter((product: Product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? product.subCategoryId === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenModal = (product?: Product) => {
    setSelectedProduct(product || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedProduct) {
        await updateProduct.mutateAsync({ id: selectedProduct.id, data });
      } else {
        await createProduct.mutateAsync(data);
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="text-green-600 dark:text-green-500" />
            Product Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage listings, stock counts, grades, and geographical tags
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors shadow-sm shadow-green-500/20"
        >
          <Plus size={18} />
          List Product
        </button>
      </div>

      {/* Filters Area */}
      <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-sm">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <SlidersHorizontal size={18} className="text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="block w-full md:w-48 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors sm:text-sm"
          >
            <option value="">All Categories</option>
            {subCategories.data?.map((sc) => (
              <option key={sc.id} value={sc.id}>{sc.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {products.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i: number) => (
            <div key={i} className="animate-pulse bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 space-y-4">
              <div className="w-full h-40 bg-gray-200 dark:bg-gray-800 rounded-xl" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : products.isError ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl">
          <p className="text-red-500 font-medium">Failed to load product listings.</p>
          <button
            onClick={() => products.refetch()}
            className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Retry Fetch
          </button>
        </div>
      ) : paginatedProducts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl">
          <p className="text-gray-500 dark:text-gray-400">No products found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product: any) => {
          const primaryImg =
            product.images?.find((img: any) => img.isPrimary)?.imageUrl ||
            product.images?.[0]?.imageUrl ||
            null;

          const placeholderSvg =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Cg transform='translate(200,140)'%3E%3Ccircle r='48' fill='%2386efac' opacity='0.4'/%3E%3Cpath d='M0,-28 C14,-28 28,-14 28,0 C28,20 14,32 0,32 C-14,32 -28,20 -28,0 C-28,-14 -14,-28 0,-28 Z' fill='%2322c55e' opacity='0.7'/%3E%3Cpath d='M-8,4 L0,-20 L8,4 Z' fill='%2315803d'/%3E%3C/g%3E%3Ctext x='200' y='215' font-family='system-ui' font-size='13' fill='%239ca3af' text-anchor='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E";

            return (
              <div 
                key={product.id} 
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow relative group"
              >
                {/* Product Image */}
                <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800">
                  <img
                    src={primaryImg ?? placeholderSvg}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = placeholderSvg; }}
                  />
                  {product.grade && (
                    <span className="absolute top-3 left-3 bg-green-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                      Grade: {product.grade.name}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white truncate">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                      {product.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm font-semibold text-gray-900 dark:text-white">
                      <span>₹{product.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Qty: {product.quantity} {product.unit?.name || 'units'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Tag size={12} />
                        {product.subCategory?.name || 'General'}
                      </span>
                      {product.latitude && product.longitude && (
                        <span className="flex items-center gap-0.5 text-blue-500">
                          <MapPin size={12} />
                          Geo-tagged
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions overlay / footer */}
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      Owner ID: {product.ownerId.slice(0, 8)}...
                    </span>

                    {deleteConfirm === product.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-medium"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        onSubmit={handleSubmit}
        isLoading={createProduct.isPending || updateProduct.isPending}
      />
    </div>
  );
}
