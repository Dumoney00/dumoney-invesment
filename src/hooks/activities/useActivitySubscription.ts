
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Activity } from '@/types/activity';
import { ACTIVITY_REFRESH_INTERVAL } from './activityConstants';

export const useActivitySubscription = (
  activities: Activity[],
  fetchAllActivities: () => Promise<Activity[]>,
  setHasNewActivity: (value: boolean) => void,
  loading: boolean
) => {
  // Check for new activities and provide notification
  const checkForNewActivities = useCallback(async (fetchedActivities: Activity[]) => {
    if (activities.length > 0 && fetchedActivities.length > 0) {
      // Check if the newest activity in fetchedActivities is newer than the newest activity in the current state
      const newestCurrentTimestamp = new Date(activities[0]?.timestamp || 0).getTime();
      const newestFetchedTimestamp = new Date(fetchedActivities[0]?.timestamp || 0).getTime();
      
      if (newestFetchedTimestamp > newestCurrentTimestamp) {
        setHasNewActivity(true);
        // Play notification sound if we're not on the initial load
        if (!loading) {
          try {
            const audio = new Audio('/notification.mp3');
            audio.play().catch(e => console.log('Audio play failed:', e));
            
            // Show toast notification
            toast({
              title: "New Activity",
              description: "New user activity detected",
              variant: "default",
            });
          } catch (error) {
            console.error('Failed to play notification sound:', error);
          }
        }
        return true;
      }
    }
    return false;
  }, [activities, loading, setHasNewActivity]);

  // Setup real-time subscription
  useEffect(() => {
    // Set up real-time subscriptions for transactions and activity logs
    const transactionsChannel = supabase
      .channel('transactions-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transactions'
      }, (payload) => {
        console.log('Real-time transaction change detected:', payload);
        fetchAllActivities();
      })
      .subscribe((status) => {
        console.log('Transactions subscription status:', status);
      });

    const activitiesChannel = supabase
      .channel('activity-logs-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'activity_logs'
      }, (payload) => {
        console.log('Real-time activity log change detected:', payload);
        fetchAllActivities();
      })
      .subscribe((status) => {
        console.log('Activity logs subscription status:', status);
      });

    // Set up a regular refresh interval as a fallback
    const refreshInterval = setInterval(() => {
      fetchAllActivities();
    }, ACTIVITY_REFRESH_INTERVAL);

    return () => {
      supabase.removeChannel(transactionsChannel);
      supabase.removeChannel(activitiesChannel);
      clearInterval(refreshInterval);
    };
  }, [fetchAllActivities]);
  
  return { checkForNewActivities };
};
