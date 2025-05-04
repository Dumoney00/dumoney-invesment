
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Activity } from '@/types/activity';
import { fetchActivities, getActivityStats } from './activityService';

export interface ActivityStats {
  totalDeposits: number;
  totalWithdraws: number;
  totalProducts: number;
  lastActive: string;
}

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ActivityStats>({
    totalDeposits: 0,
    totalWithdraws: 0,
    totalProducts: 0,
    lastActive: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  // Fetch activities when user changes
  useEffect(() => {
    const loadActivities = async () => {
      setLoading(true);
      try {
        const activitiesData = await fetchActivities(user);
        setActivities(activitiesData);
        setStats(getActivityStats(activitiesData));
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [user]);

  return {
    activities,
    stats,
    loading,
  };
};
