
import { useState, useEffect, useCallback } from 'react';
import { Activity } from '@/types/activity';
import { mapTransactionToActivity } from '@/types/activity';
import { useAuth } from '@/contexts/AuthContext';
import { 
  generateActivityStats, 
  generateRandomUserActivities
} from './activityUtils';
import { 
  ACTIVITY_REFRESH_INTERVAL, 
  ACTIVITY_QUICK_REFRESH_INTERVAL 
} from './activityConstants';
import { fetchActivities } from './activityService';

export interface ActivityStats {
  totalUsers: number;
  totalAmount: number;
  deposits: { count: number; amount: number };
  withdrawals: { count: number; amount: number };
  investments: { count: number; amount: number };
}

export const useActivities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ActivityStats>({
    totalUsers: 0,
    totalAmount: 0,
    deposits: { count: 0, amount: 0 },
    withdrawals: { count: 0, amount: 0 },
    investments: { count: 0, amount: 0 },
  });
  const [loading, setLoading] = useState(true);

  // Function to refresh activities
  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedActivities = await fetchActivities();

      // Add user's own transactions if they exist
      if (user && user.transactions && user.transactions.length > 0) {
        const userActivities = user.transactions.map(transaction => 
          mapTransactionToActivity({
            ...transaction,
            userName: user.username || 'Anonymous',
            userId: user.id
          })
        );
        
        // Merge and sort all activities by timestamp
        const allActivities = [...fetchedActivities, ...userActivities].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setActivities(allActivities as Activity[]);
        setStats(generateActivityStats(allActivities as Activity[]));
        return allActivities as Activity[];
      } else {
        setActivities(fetchedActivities as Activity[]);
        setStats(generateActivityStats(fetchedActivities as Activity[]));
        return fetchedActivities as Activity[];
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      return [] as Activity[];
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    refresh();
    
    // Set up regular refresh interval
    const intervalId = setInterval(refresh, ACTIVITY_REFRESH_INTERVAL);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [refresh]);

  return { activities, stats, loading, refresh };
};
