import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analytics.api';

export function useAI() {
  const insightsQuery = useQuery({ queryKey: ['ai-insights'], queryFn: analyticsApi.getAIInsights });
  
  return {
    insights: insightsQuery,
  };
}
