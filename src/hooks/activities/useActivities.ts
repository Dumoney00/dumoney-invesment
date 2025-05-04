
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ActivityHookResult } from './types';
import { useFetchActivities } from './useFetchActivities';

export const useActivities = (): ActivityHookResult => {
  const { user } = useAuth();
  const { activities, stats, loading, refresh } = useFetchActivities(user);

  // Fetch activities when user changes
  useEffect(() => {
    refresh();
  }, [user]);

  return {
    activities,
    stats,
    loading,
    refresh,
  };
};

// Export the ActivityStats type for backward compatibility
export type { ActivityStats } from './types';
