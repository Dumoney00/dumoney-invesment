
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAllActivitiesFetcher } from './activities/useAllActivitiesFetcher';
import { useActivitySubscription } from './activities/useActivitySubscription';

export const useAllUserActivities = () => {
  const [hasNewActivity, setHasNewActivity] = useState(false);
  const { user: currentUser } = useAuth();
  
  const { 
    activities, 
    stats, 
    loading, 
    fetchAllActivities 
  } = useAllActivitiesFetcher(currentUser);
  
  const { checkForNewActivities } = useActivitySubscription(
    activities, 
    fetchAllActivities, 
    setHasNewActivity, 
    loading
  );
  
  const refresh = useCallback(async () => {
    setHasNewActivity(false);
    const fetchedActivities = await fetchAllActivities();
    await checkForNewActivities(fetchedActivities);
    return fetchedActivities;
  }, [fetchAllActivities, checkForNewActivities]);

  return {
    activities,
    stats,
    loading,
    refresh,
    hasNewActivity,
    setHasNewActivity
  };
};
