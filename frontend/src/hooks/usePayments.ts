import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi, CreatePaymentPayload, VerifyPaymentPayload } from '../api/payments.api';

export function usePayments(page = 1, limit = 20) {
  const queryClient = useQueryClient();

  const paymentsQuery = useQuery({
    queryKey: ['payments', page, limit],
    queryFn: () => paymentsApi.getAllPayments(page, limit),
  });

  const getPaymentByOrder = (orderId: string) =>
    useQuery({
      queryKey: ['payment', 'order', orderId],
      queryFn: () => paymentsApi.getPaymentByOrder(orderId),
      enabled: !!orderId,
    });

  const createPaymentMutation = useMutation({
    mutationFn: (data: CreatePaymentPayload) => paymentsApi.createPaymentOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: (data: VerifyPaymentPayload) => paymentsApi.verifyPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });

  return {
    payments: paymentsQuery,
    getPaymentByOrder,
    createPayment: createPaymentMutation,
    verifyPayment: verifyPaymentMutation,
  };
}
