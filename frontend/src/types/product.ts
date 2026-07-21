export interface Category {
  id: string;
  name: string;
}

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  category?: Category;
}

export interface Unit {
  id: string;
  name: string;
}

export interface Grade {
  id: string;
  name: string;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  productId: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  quantity: number;
  latitude?: number;
  longitude?: number;
  unitId?: string;
  gradeId?: string;
  subCategoryId?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  unit?: Unit;
  grade?: Grade;
  subCategory?: SubCategory;
  images?: ProductImage[];
  owner?: {
    id: string;
    name: string;
    email: string;
  };
}
