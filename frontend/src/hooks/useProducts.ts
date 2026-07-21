import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, CreateProductPayload, UpdateProductPayload } from '../api/products.api';

export function useProducts(params?: any) {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getProducts(params),
  });

  const createProductMutation = useMutation({
    mutationFn: (data: CreateProductPayload) => productsApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductPayload }) =>
      productsApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    products: productsQuery,
    createProduct: createProductMutation,
    updateProduct: updateProductMutation,
    deleteProduct: deleteProductMutation,
  };
}

export function useProductMetadata() {
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getCategories,
  });

  const subCategoriesQuery = useQuery({
    queryKey: ['subcategories'],
    queryFn: productsApi.getSubCategories,
  });

  const unitsQuery = useQuery({
    queryKey: ['units'],
    queryFn: productsApi.getUnits,
  });

  const gradesQuery = useQuery({
    queryKey: ['grades'],
    queryFn: productsApi.getGrades,
  });

  return {
    categories: categoriesQuery,
    subCategories: subCategoriesQuery,
    units: unitsQuery,
    grades: gradesQuery,
  };
}
