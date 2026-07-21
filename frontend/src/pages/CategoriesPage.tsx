import React, { useState } from 'react';
import { useProductMetadata } from '../hooks/useProducts';
import { Tag, Plus, Grid, ListTree, Hash, Award } from 'lucide-react';
import { productsApi } from '../api/products.api';
import { useQueryClient } from '@tanstack/react-query';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const { categories, subCategories, units, grades } = useProductMetadata();
  const [activeTab, setActiveTab] = useState<'categories' | 'subcategories' | 'units' | 'grades'>('categories');
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    setIsSubmitting(true);
    try {
      if (activeTab === 'categories') {
        await productsApi.createCategory(newName);
        queryClient.invalidateQueries({ queryKey: ['categories'] });
      } else if (activeTab === 'subcategories') {
        await productsApi.createSubCategory(newName, selectedCategoryId);
        queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      } else if (activeTab === 'units') {
        await productsApi.createUnit(newName);
        queryClient.invalidateQueries({ queryKey: ['units'] });
      } else if (activeTab === 'grades') {
        await productsApi.createGrade(newName);
        queryClient.invalidateQueries({ queryKey: ['grades'] });
      }
      setNewName('');
      setSelectedCategoryId('');
      setIsAdding(false);
    } catch (err) {
      console.error('Failed to create item', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    let data: any[] = [];
    let loading = false;
    if (activeTab === 'categories') { data = categories.data || []; loading = categories.isLoading; }
    if (activeTab === 'subcategories') { data = subCategories.data || []; loading = subCategories.isLoading; }
    if (activeTab === 'units') { data = units.data || []; loading = units.isLoading; }
    if (activeTab === 'grades') { data = grades.data || []; loading = grades.isLoading; }

    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse h-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-800" />
          ))}
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-12 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
          <p className="text-gray-500">No {activeTab} found. Create one to get started.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
              {activeTab === 'subcategories' && item.category && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Grid size={12} />
                  {item.category.name}
                </p>
              )}
            </div>
            <div className="text-[10px] text-gray-400 font-mono">
              {item.id.slice(0, 6)}...
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Tag className="text-green-600 dark:text-green-500" />
            Metadata & Categories
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure global product categories, subcategories, units, and grades.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors shadow-sm shadow-green-500/20"
        >
          <Plus size={18} />
          Add {activeTab.slice(0, -1)}
        </button>
      </div>

      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-full max-w-2xl">
        {[
          { id: 'categories', label: 'Categories', icon: Grid },
          { id: 'subcategories', label: 'Sub-Categories', icon: ListTree },
          { id: 'units', label: 'Units', icon: Hash },
          { id: 'grades', label: 'Grades', icon: Award },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setIsAdding(false); setNewName(''); }}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-900 text-green-600 dark:text-green-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1 w-full">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={`Enter ${activeTab.slice(0, -1)} name...`}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 dark:text-white"
            />
          </div>

          {activeTab === 'subcategories' && (
            <div className="flex-1 space-y-1 w-full">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Parent Category</label>
              <select
                required
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 dark:text-white"
              >
                <option value="">Select Category</option>
                {categories.data?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </form>
      )}

      {renderContent()}
    </div>
  );
}
