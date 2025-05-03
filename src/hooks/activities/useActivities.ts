
import { useState, useEffect, useRef } from 'react';
import { Activity, mapTransactionToActivity } from '@/components/home/ActivityFeed';
import { TransactionRecord } from '@/types/auth';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/components/ui/use-toast';
import { getTransactionsFromSupabase } from './activityService';
import { calculateActivityStats, activitiesHaveChanged } from './activityUtils';
import { ACTIVITY_REFRESH_INTERVAL, ACTIVITY_MIN_REFRESH_DELAY } from './activityConstants';

export interface ActivityStats {
  todayDeposits: number;
  todayWithdrawals: number;
}

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ActivityStats>({
    todayDeposits: 0,
    todayWithdrawals: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const prevActivitiesRef = useRef<Activity[]>([]);
  const lastFetchRef = useRef<Date>(new Date());
  const retryTimeoutRef = useRef<number | null>(null);

  const fetchActivities = async (forceRefresh = false) => {
    try {
      // If it's been less than min delay since last fetch and not forced, skip
      const now = new Date();
      if (!forceRefresh && 
          now.getTime() - lastFetchRef.current.getTime() < ACTIVITY_MIN_REFRESH_DELAY) {
        return;
      }
      
      lastFetchRef.current = now;
      
      if (!loading && !forceRefresh) {
        setLoading(true);
      }
      
      // Try to fetch from Supabase first, fall back to localStorage if needed
      const allTransactions = await getTransactionsFromSupabase();
      
      // Filter transactions to show only deposits, withdrawals, and purchases
      const filteredTransactions = allTransactions.filter(
        transaction => ['deposit', 'withdraw', 'purchase', 'sale', 'dailyIncome', 'referralBonus'].includes(transaction.type)
      );
      
      // Sort transactions by timestamp, newest first
      const sortedTransactions = filteredTransactions.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Map transactions to activities
      const mappedActivities = sortedTransactions.map(mapTransactionToActivity);
      
      // Calculate today's stats
      const activityStats = calculateActivityStats(filteredTransactions);
      setStats(activityStats);
      
      // Compare with previous activities to avoid unnecessary re-renders
      const prevActivities = prevActivitiesRef.current;
      
      if (activitiesHaveChanged(mappedActivities, prevActivities)) {
        setActivities(mappedActivities);
        prevActivitiesRef.current = mappedActivities;
      }
      
      if (error) setError(null); // Clear any previous errors
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch activities'));
      setLoading(false);
      
      // Show error notification only on forced refreshes or initial load
      if (forceRefresh) {
        toast({
          title: "Error fetching activities",
          description: "Please try again later",
          variant: "destructive"
        });
      }
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchActivities(true);
    
    // Set up a refresh interval
    const intervalId = setInterval(() => fetchActivities(), ACTIVITY_REFRESH_INTERVAL);
    
    // Add storage event listener for real-time updates across tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'investmentUsers' || event.key === 'investmentUser') {
        console.log('User data changed in another tab, refreshing activities');
        fetchActivities(true);
      }
    };
    
    // Listen for realtime updates from Supabase
    const channel = supabase
      .channel('public:transactions')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'transactions' 
      }, (payload) => {
        console.log('Supabase realtime update received:', payload);
        fetchActivities(true);
      })
      .subscribe(status => {
        console.log('Supabase channel status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to realtime updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to realtime updates');
          
          // If we can't subscribe to realtime updates, increase the polling frequency
          clearInterval(intervalId);
          const fastIntervalId = setInterval(() => fetchActivities(), ACTIVITY_QUICK_REFRESH_INTERVAL);
          
          return () => clearInterval(fastIntervalId);
        }
      });
    
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up intervals and event listeners on component unmount
    return () => {
      clearInterval(intervalId);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      window.removeEventListener('storage', handleStorageChange);
      supabase.removeChannel(channel);
    };
  }, []);
  
  return { 
    activities, 
    stats, 
    loading, 
    error, 
    refresh: () => fetchActivities(true) 
  };
};
