import { useQuery } from '@tanstack/react-query';
import { activityApi } from '../api/activity.api';

export function useActivity(isAdmin: boolean = false) {
  const activitiesQuery = useQuery({
    queryKey: ['activities', isAdmin],
    queryFn: isAdmin ? activityApi.getAllActivities : activityApi.getUserActivities,
  });

  return {
    activities: activitiesQuery,
  };
}
