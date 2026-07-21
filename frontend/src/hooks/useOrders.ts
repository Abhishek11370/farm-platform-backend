import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, CreateOrderPayload, UpdateOrderStatusPayload } from '../api/orders.api';

export function useOrders() {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.getOrders,
  });

  const createOrderMutation = useMutation({
    mutationFn: (data: CreateOrderPayload) => ordersApi.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusPayload }) =>
      ordersApi.updateOrderStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => ordersApi.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  return {
    orders: ordersQuery,
    createOrder: createOrderMutation,
    updateOrderStatus: updateOrderStatusMutation,
    deleteOrder: deleteOrderMutation,
  };
}

/** Admin-scoped hook: fetches ALL platform orders regardless of user */
export function useAllAdminOrders() {
  const queryClient = useQueryClient();

  const allOrdersQuery = useQuery({
    queryKey: ['admin-orders'],
    queryFn: ordersApi.getAllOrdersAdmin,
    staleTime: 30_000,
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusPayload }) =>
      ordersApi.updateOrderStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  return {
    orders: allOrdersQuery,
    updateOrderStatus: updateOrderStatusMutation,
  };
}
