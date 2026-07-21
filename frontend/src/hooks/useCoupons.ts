import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { couponsApi, CreateCouponPayload } from '../api/coupons.api';

export function useCoupons(page = 1, limit = 20) {
  const queryClient = useQueryClient();

  const couponsQuery = useQuery({
    queryKey: ['coupons', page, limit],
    queryFn: () => couponsApi.getCoupons(page, limit),
  });

  const createCouponMutation = useMutation({
    mutationFn: (data: CreateCouponPayload) => couponsApi.createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });

  const toggleCouponMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      couponsApi.toggleCoupon(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });

  const deleteCouponMutation = useMutation({
    mutationFn: (id: string) => couponsApi.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });

  return {
    coupons: couponsQuery,
    createCoupon: createCouponMutation,
    toggleCoupon: toggleCouponMutation,
    deleteCoupon: deleteCouponMutation,
  };
}
