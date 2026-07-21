import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportApi } from '../api/support.api';

export function useSupport() {
  const queryClient = useQueryClient();

  const ticketsQuery = useQuery({ queryKey: ['support-tickets'], queryFn: supportApi.getTickets });
  
  const replyToTicket = useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) => supportApi.replyToTicket(id, message),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['support-tickets'] }),
  });

  const closeTicket = useMutation({
    mutationFn: supportApi.closeTicket,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['support-tickets'] }),
  });

  return {
    tickets: ticketsQuery,
    replyToTicket,
    closeTicket,
  };
}
