import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auctionsApi, CreateAuctionPayload } from '../api/auctions.api';

export function useAuctions() {
  const queryClient = useQueryClient();

  const auctionsQuery = useQuery({
    queryKey: ['auctions'],
    queryFn: () => auctionsApi.getAuctions(),
  });

  const createAuctionMutation = useMutation({
    mutationFn: (data: CreateAuctionPayload) => auctionsApi.createAuction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });

  const placeBidMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      auctionsApi.placeBid(id, amount),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auction', id] });
    },
  });

  return {
    auctions: auctionsQuery,
    createAuction: createAuctionMutation,
    placeBid: placeBidMutation,
  };
}
