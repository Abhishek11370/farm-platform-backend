import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi, CreateReviewPayload } from '../api/reviews.api';

export function useReviews(productId?: string, page = 1, limit = 10) {
  const queryClient = useQueryClient();

  const productReviewsQuery = useQuery({
    queryKey: ['reviews', 'product', productId, page, limit],
    queryFn: () => reviewsApi.getReviewsByProduct(productId!, page, limit),
    enabled: !!productId,
  });

  const myReviewsQuery = useQuery({
    queryKey: ['reviews', 'mine'],
    queryFn: () => reviewsApi.getMyReviews(),
  });

  const allReviewsQuery = useQuery({
    queryKey: ['reviews', 'all', page, limit],
    queryFn: () => reviewsApi.getAllReviews(page, limit),
  });

  const createReviewMutation = useMutation({
    mutationFn: (data: CreateReviewPayload) => reviewsApi.createReview(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'mine'] });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (id: string) => reviewsApi.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  return {
    productReviews: productReviewsQuery,
    myReviews: myReviewsQuery,
    allReviews: allReviewsQuery,
    createReview: createReviewMutation,
    deleteReview: deleteReviewMutation,
  };
}
