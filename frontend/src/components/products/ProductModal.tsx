import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import { useProductMetadata } from '../../hooks/useProducts';
import { Product } from '../../types/product';

const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be 0 or greater'),
  quantity: z.number().min(0, 'Quantity must be 0 or greater'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  unitId: z.string().min(1, 'Unit is required'),
  gradeId: z.string().min(1, 'Grade is required'),
  subCategoryId: z.string().min(1, 'Category is required'),
  imageUrls: z.string().optional(), // Comma-separated list of image URLs
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export default function ProductModal({ isOpen, onClose, product, onSubmit, isLoading }: ProductModalProps) {
  const { categories, subCategories, units, grades } = useProductMetadata();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      quantity: 0,
      latitude: undefined,
      longitude: undefined,
      unitId: '',
      gradeId: '',
      subCategoryId: '',
      imageUrls: '',
    },
  });

  useEffect(() => {
    if (product && isOpen) {
      reset({
        title: product.title,
        description: product.description || '',
        price: product.price,
        quantity: product.quantity,
        latitude: product.latitude,
        longitude: product.longitude,
        unitId: product.unitId || '',
        gradeId: product.gradeId || '',
        subCategoryId: product.subCategoryId || '',
        imageUrls: product.images?.map((img) => img.imageUrl).join(', ') || '',
      });
    } else if (!product && isOpen) {
      reset({
        title: '',
        description: '',
        price: 0,
        quantity: 0,
        latitude: undefined,
        longitude: undefined,
        unitId: '',
        gradeId: '',
        subCategoryId: '',
        imageUrls: '',
      });
    }
  }, [product, isOpen, reset]);

  if (!isOpen) return null;

  const submitHandler = async (data: ProductFormValues) => {
    const payload: any = {
      ...data,
      images: data.imageUrls ? data.imageUrls.split(',').map((url: string) => url.trim()).filter(Boolean) : [],
    };
    delete payload.imageUrls;
    await onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800 my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {product ? 'Edit Product Listing' : 'Add New Product Listing'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Title</label>
            <input
              {...register('title')}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white transition-all"
              placeholder="e.g. Organic Red Tomatoes"
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white transition-all resize-none"
              placeholder="Provide details about the freshness, variety, and delivery conditions..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price (₹)</label>
              <input
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white transition-all"
              />
              {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
              <input
                type="number"
                step="0.1"
                {...register('quantity', { valueAsNumber: true })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white transition-all"
              />
              {errors.quantity && <p className="text-xs text-red-500">{errors.quantity.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Unit</label>
              <select
                {...register('unitId')}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white transition-all"
              >
                <option value="">Select Unit</option>
                {units.data?.map((unit) => (
                  <option key={unit.id} value={unit.id}>{unit.name}</option>
                ))}
              </select>
              {errors.unitId && <p className="text-xs text-red-500">{errors.unitId.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Grade</label>
              <select
                {...register('gradeId')}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white transition-all"
              >
                <option value="">Select Grade</option>
                {grades.data?.map((grade) => (
                  <option key={grade.id} value={grade.id}>{grade.name}</option>
                ))}
              </select>
              {errors.gradeId && <p className="text-xs text-red-500">{errors.gradeId.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sub-Category</label>
              <select
                {...register('subCategoryId')}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white transition-all"
              >
                <option value="">Select Category</option>
                {subCategories.data?.map((sc) => (
                  <option key={sc.id} value={sc.id}>{sc.name}</option>
                ))}
              </select>
              {errors.subCategoryId && <p className="text-xs text-red-500">{errors.subCategoryId.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Latitude (Optional)</label>
              <input
                type="number"
                step="0.000001"
                {...register('latitude', { valueAsNumber: true })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Longitude (Optional)</label>
              <input
                type="number"
                step="0.000001"
                {...register('longitude', { valueAsNumber: true })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Image URLs (Comma separated, optional)
            </label>
            <input
              {...register('imageUrls')}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white transition-all"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors shadow-sm shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : product ? (
                'Save Changes'
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
