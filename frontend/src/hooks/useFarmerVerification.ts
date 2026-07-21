import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { farmerVerificationApi, ReviewVerificationPayload } from '../api/farmer-verification.api';

export function useFarmerVerification(page = 1, limit = 20, status?: string) {
  const queryClient = useQueryClient();

  const verificationsQuery = useQuery({
    queryKey: ['farmer-verifications', page, limit, status],
    queryFn: () => farmerVerificationApi.getVerifications(page, limit, status),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReviewVerificationPayload }) => 
      farmerVerificationApi.reviewVerification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-verifications'] });
      queryClient.invalidateQueries({ queryKey: ['farmers'] }); // Since approval might update the farmer profile
    },
  });

  return {
    verifications: verificationsQuery,
    reviewVerification: reviewMutation,
  };
}
