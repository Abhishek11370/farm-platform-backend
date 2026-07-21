import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistsApi } from '../api/wishlists.api';

export function useWishlists() {
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistsApi.getWishlist,
  });

  const addToWishlistMutation = useMutation({
    mutationFn: (productId: string) => wishlistsApi.addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (productId: string) => wishlistsApi.removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const clearWishlistMutation = useMutation({
    mutationFn: () => wishlistsApi.clearWishlist(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  return {
    wishlist: wishlistQuery,
    addToWishlist: addToWishlistMutation,
    removeFromWishlist: removeFromWishlistMutation,
    clearWishlist: clearWishlistMutation,
  };
}
