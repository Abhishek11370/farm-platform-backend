import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../api/settings.api';

export function useSettings() {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({ queryKey: ['settings'], queryFn: settingsApi.getSettings });
  
  const bulkUpsert = useMutation({
    mutationFn: settingsApi.bulkUpsert,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });

  return {
    settings: settingsQuery,
    bulkUpsert,
  };
}
