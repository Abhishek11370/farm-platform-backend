import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Package, Search, Filter, Edit2, CheckCircle } from 'lucide-react';

export default function InventoryPage() {
  const { products, updateProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState<number>(0);

  const inventory = products.data || [];
  const filtered = inventory.filter((p: any) => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (id: string) => {
    updateProduct.mutate({ id, data: { quantity: editQty } }, {
      onSuccess: () => setEditingId(null)
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="text-blue-600 dark:text-blue-500" />
            Global Inventory
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor and manage stock levels across all farmers.</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Farmer (Owner)</th>
                <th className="px-6 py-4">Stock Level</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.isLoading && (
                <tr><td colSpan={5} className="px-6 py-8 text-center">Loading inventory...</td></tr>
              )}
              {filtered.map((item: any) => (
                <tr key={item.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                    <img src={item.images?.[0]?.imageUrl || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    {item.title}
                  </td>
                  <td className="px-6 py-4">{item.owner?.name}</td>
                  <td className="px-6 py-4">
                    {editingId === item.id ? (
                      <input 
                        type="number" 
                        value={editQty} 
                        onChange={e => setEditQty(Number(e.target.value))}
                        className="w-24 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 text-gray-900 dark:text-white"
                        autoFocus
                      />
                    ) : (
                      <span className="font-semibold text-gray-900 dark:text-white">{item.quantity} {item.unit?.name || 'units'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {item.quantity === 0 ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Out of Stock</span>
                    ) : item.quantity < 10 ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">Low Stock</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">In Stock</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingId === item.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700 text-xs font-medium">Cancel</button>
                        <button onClick={() => handleSave(item.id)} className="text-blue-600 hover:text-blue-700"><CheckCircle size={18}/></button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => { setEditingId(item.id); setEditQty(item.quantity); }}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !products.isLoading && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
