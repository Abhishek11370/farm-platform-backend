import api from './axios';
import { Product, Category, SubCategory, Unit, Grade } from '../types/product';

export interface CreateProductPayload {
  title: string;
  description?: string;
  price: number;
  quantity: number;
  latitude?: number;
  longitude?: number;
  unitId?: string;
  gradeId?: string;
  subCategoryId?: string;
  images?: string[];
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}

export const productsApi = {
  getProducts: async (params?: any): Promise<Product[]> => {
    const response = await api.get('/product', { params });
    return response.data?.products || response.data || [];
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get(`/product/${id}`);
    return response.data;
  },

  createProduct: async (payload: CreateProductPayload): Promise<Product> => {
    const response = await api.post('/product', payload);
    return response.data;
  },

  updateProduct: async (id: string, payload: UpdateProductPayload): Promise<Product> => {
    const response = await api.put(`/product/${id}`, payload);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/product/${id}`);
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/product/categories');
    return response.data;
  },

  createCategory: async (name: string): Promise<Category> => {
    const response = await api.post('/product/categories', { name });
    return response.data;
  },

  getSubCategories: async (): Promise<SubCategory[]> => {
    const response = await api.get('/product/subcategories');
    return response.data;
  },

  createSubCategory: async (name: string, categoryId: string): Promise<SubCategory> => {
    const response = await api.post('/product/subcategories', { name, categoryId });
    return response.data;
  },

  getUnits: async (): Promise<Unit[]> => {
    const response = await api.get('/product/units');
    return response.data;
  },

  createUnit: async (name: string): Promise<Unit> => {
    const response = await api.post('/product/units', { name });
    return response.data;
  },

  getGrades: async (): Promise<Grade[]> => {
    const response = await api.get('/product/grades');
    return response.data;
  },

  createGrade: async (name: string): Promise<Grade> => {
    const response = await api.post('/product/grades', { name });
    return response.data;
  },

  addProductImage: async (productId: string, imageUrl: string, isPrimary?: boolean): Promise<any> => {
    const response = await api.post(`/product/${productId}/images`, { imageUrl, isPrimary });
    return response.data;
  },

  deleteProductImage: async (productId: string, imageId: string): Promise<void> => {
    await api.delete(`/product/${productId}/images/${imageId}`);
  },
};
