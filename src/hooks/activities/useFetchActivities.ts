
import { useState } from 'react';
import { Activity } from '@/types/activity';
import { ActivityStats } from './types';
import { fetchActivities, getActivityStats } from './activityService';
import { User } from '@/types/auth';

export const useFetchActivities = (user: User | null) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ActivityStats>({
    totalDeposits: 0,
    totalWithdraws: 0,
    totalProducts: 0,
    lastActive: '',
    todayDeposits: 0,
    todayWithdrawals: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const activitiesData = await fetchActivities(user);
      setActivities(activitiesData);
      setStats(getActivityStats(activitiesData) as ActivityStats);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    activities,
    stats,
    loading,
    refresh,
  };
};
