
import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Activity } from '@/types/activity';
import { 
  ACTIVITY_REFRESH_INTERVAL, 
  ACTIVITY_QUICK_REFRESH_INTERVAL,
  ACTIVITY_MIN_REFRESH_DELAY,
  TOAST_REMOVE_DELAY
} from './activityConstants';

export const useActivitySubscription = (
  activities: Activity[],
  fetchAllActivities: () => Promise<Activity[]>,
  setHasNewActivity: (value: boolean) => void,
  loading: boolean
) => {
  const lastFetchTime = useRef<number>(Date.now());
  const lastNotificationTime = useRef<number>(Date.now());
  const isMounted = useRef<boolean>(true);

  // Check for new activities and provide notification
  const checkForNewActivities = useCallback(async (fetchedActivities: Activity[]) => {
    if (!isMounted.current) return false;
    if (activities.length > 0 && fetchedActivities.length > 0) {
      // Check if the newest activity in fetchedActivities is newer than the newest activity in the current state
      const newestCurrentTimestamp = new Date(activities[0]?.timestamp || 0).getTime();
      const newestFetchedTimestamp = new Date(fetchedActivities[0]?.timestamp || 0).getTime();
      
      if (newestFetchedTimestamp > newestCurrentTimestamp) {
        console.log('New activity detected:', fetchedActivities[0]);
        setHasNewActivity(true);
        
        // Play notification sound if we're not on the initial load
        // and we haven't shown a notification recently (within the last 10 seconds)
        const currentTime = Date.now();
        if (!loading && (currentTime - lastNotificationTime.current > TOAST_REMOVE_DELAY)) {
          try {
            const audio = new Audio('/notification.mp3');
            audio.play().catch(e => console.log('Audio play failed:', e));
            
            // Show toast notification
            toast({
              title: "New Activity",
              description: "New user activity detected",
              variant: "default",
            });
            
            // Update last notification time
            lastNotificationTime.current = currentTime;
          } catch (error) {
            console.error('Failed to play notification sound:', error);
          }
        }
        return true;
      }
    }
    return false;
  }, [activities, loading, setHasNewActivity, toast]);

  // Setup real-time subscription
  useEffect(() => {
    console.log('Setting up real-time subscriptions for activities');
    isMounted.current = true;
    
    // Set up real-time subscriptions for transactions and activity logs
    const transactionsChannel = supabase
      .channel('real-time-transactions')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transactions'
      }, async (payload) => {
        console.log('Real-time transaction change detected:', payload);
        
        // Check if we should throttle the refresh
        const currentTime = Date.now();
        if (currentTime - lastFetchTime.current > ACTIVITY_MIN_REFRESH_DELAY) {
          console.log('Refreshing after transaction change');
          const newActivities = await fetchAllActivities();
          checkForNewActivities(newActivities);
          lastFetchTime.current = currentTime;
        }
      })
      .subscribe((status) => {
        console.log('Transactions subscription status:', status);
      });

    const activitiesChannel = supabase
      .channel('real-time-activity-logs')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'activity_logs'
      }, async (payload) => {
        console.log('Real-time activity log change detected:', payload);
        
        // Check if we should throttle the refresh
        const currentTime = Date.now();
        if (currentTime - lastFetchTime.current > ACTIVITY_MIN_REFRESH_DELAY) {
          console.log('Refreshing after activity log change');
          const newActivities = await fetchAllActivities();
          checkForNewActivities(newActivities);
          lastFetchTime.current = currentTime;
        }
      })
      .subscribe((status) => {
        console.log('Activity logs subscription status:', status);
      });

    // Do an immediate refresh when component mounts
    fetchAllActivities();

    // Set up a regular refresh interval as a fallback
    const refreshInterval = setInterval(async () => {
      console.log('Running scheduled activity refresh');
      const newActivities = await fetchAllActivities();
      checkForNewActivities(newActivities);
    }, ACTIVITY_REFRESH_INTERVAL);

    // Set up a more frequent refresh for quick updates
    const quickRefreshInterval = setInterval(async () => {
      console.log('Running quick activity check');
      const newActivities = await fetchAllActivities();
      checkForNewActivities(newActivities);
    }, ACTIVITY_QUICK_REFRESH_INTERVAL);

    // Clean up function
    return () => {
      isMounted.current = false;
      console.log('Cleaning up activity subscriptions');
      supabase.removeChannel(transactionsChannel);
      supabase.removeChannel(activitiesChannel);
      clearInterval(refreshInterval);
      clearInterval(quickRefreshInterval);
    };
  }, [fetchAllActivities, checkForNewActivities]);
  
  return { checkForNewActivities };
};
