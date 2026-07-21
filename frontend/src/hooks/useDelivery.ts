import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deliveryApi, AssignDeliveryPayload } from '../api/delivery.api';

export function useDelivery(params?: any) {
  const queryClient = useQueryClient();

  const deliveriesQuery = useQuery({
    queryKey: ['deliveries', params],
    queryFn: () => deliveryApi.getDeliveries(params),
  });

  const assignDeliveryMutation = useMutation({
    mutationFn: (data: AssignDeliveryPayload) => deliveryApi.assignDelivery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
    },
  });

  const adminEarningsQuery = useQuery({
    queryKey: ['delivery', 'admin-earnings'],
    queryFn: deliveryApi.getAdminEarnings,
  });

  return {
    deliveries: deliveriesQuery,
    assignDelivery: assignDeliveryMutation,
    adminEarnings: adminEarningsQuery,
  };
}
