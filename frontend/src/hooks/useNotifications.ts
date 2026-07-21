import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi, SendNotificationPayload } from '../api/notifications.api';

export function useNotifications(isAdmin = false, page = 1, limit = 20) {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ['notifications', isAdmin ? 'admin' : 'mine', page, limit],
    queryFn: () => isAdmin ? notificationsApi.getAllAdmin(page, limit) : notificationsApi.getMine(page, limit),
  });

  const sendNotificationMutation = useMutation({
    mutationFn: (data: SendNotificationPayload) => notificationsApi.sendNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications: notificationsQuery,
    sendNotification: sendNotificationMutation,
    markRead: markReadMutation,
    markAllRead: markAllReadMutation,
    deleteNotification: deleteNotificationMutation,
  };
}
