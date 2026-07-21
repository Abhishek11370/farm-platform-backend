import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chat.api';

export function useChat(isAdmin = false) {
  const queryClient = useQueryClient();

  const conversationsQuery = useQuery({
    queryKey: ['chat', 'conversations', isAdmin ? 'admin' : 'mine'],
    queryFn: () => isAdmin ? chatApi.getAdminConversations(1, 100) : chatApi.getConversations(),
  });

  const getMessages = (partnerId: string) => useQuery({
    queryKey: ['chat', 'messages', partnerId],
    queryFn: () => chatApi.getMessages(partnerId, 1, 100),
    enabled: !!partnerId
  });

  const sendMessageMutation = useMutation({
    mutationFn: (data: { receiverId: string; content: string }) => chatApi.sendMessage(data.receiverId, data.content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', variables.receiverId] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    }
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (id: string) => chatApi.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat'] });
    }
  });

  return {
    conversations: conversationsQuery,
    getMessages,
    sendMessage: sendMessageMutation,
    deleteMessage: deleteMessageMutation
  };
}
