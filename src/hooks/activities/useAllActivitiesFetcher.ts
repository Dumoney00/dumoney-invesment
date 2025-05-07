
import { useState, useCallback, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { getActivityStats } from './activityService';
import { ActivityStats } from './types';
import { toast } from '@/components/ui/use-toast';

export const useAllActivitiesFetcher = (currentUser: User | null) => {
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
  const [retryCount, setRetryCount] = useState(0);

  const fetchAllActivities = useCallback(async () => {
    if (!currentUser) {
      console.log('No current user, skipping activity fetch');
      setLoading(false);
      return [];
    }

    setLoading(true);
    try {
      console.log('Fetching all activities, currentUser:', currentUser?.id, 'isAdmin:', currentUser?.isAdmin);
      let allActivities: Activity[] = [];

      // First fetch transactions
      try {
        // For admin users or regular users, fetch transactions without filtering
        const { data: transactionData, error: transactionError } = await supabase
          .from('transactions')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(100);  // Reasonable limit for performance
      
        if (transactionError) {
          console.error('Error fetching all transactions:', transactionError);
        } else if (transactionData) {
          console.log(`Fetched ${transactionData.length} transactions`);
          // Map transaction data to activities
          const transactionActivities: Activity[] = transactionData.map((tx: any) => ({
            id: tx.id,
            type: tx.type === 'purchase' ? 'investment' : tx.type,
            username: tx.approved_by || tx.username || 'User',
            userId: tx.user_id,
            timestamp: tx.timestamp,
            details: tx.details || '',
            amount: tx.amount,
            status: tx.status,
            relativeTime: '',
            bankDetails: tx.bank_details_id ? {
              accountNumber: 'xxxx',
              ifscCode: 'xxxx',
              accountHolderName: 'xxxx'
            } : undefined,
            productName: tx.product_name,
            deviceInfo: {
              type: tx.device_type || 'Unknown',
              os: tx.device_os || 'Unknown',
              location: tx.device_location || 'Unknown'
            }
          }));
          allActivities = [...allActivities, ...transactionActivities];
        }
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      }

      // Now fetch activity logs
      try {
        const { data: activityData, error: activityError } = await supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);  // Reasonable limit for performance
      
        if (activityError) {
          console.error('Error fetching all activity logs:', activityError);
        } else if (activityData) {
          console.log(`Fetched ${activityData.length} activity logs`);
          // Map activity logs to activities
          const logActivities: Activity[] = activityData.map((log: any) => ({
            id: log.id,
            type: log.activity_type as any,
            username: log.username,
            userId: log.user_id,
            timestamp: log.created_at,
            details: log.details || '',
            amount: log.amount || 0,
            status: 'completed',
            relativeTime: '',
            deviceInfo: {
              type: 'Unknown',
              os: 'Unknown',
              location: log.ip_address || 'Unknown'
            }
          }));
          allActivities = [...allActivities, ...logActivities];
        }
      } catch (err) {
        console.error('Failed to fetch activity logs:', err);
      }

      // Sort by timestamp (newest first)
      allActivities = allActivities.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      console.log(`Total activities after fetch: ${allActivities.length}`);
      
      if (allActivities.length === 0 && retryCount < 3) {
        console.log(`No activities found, retry attempt ${retryCount + 1}`);
        setRetryCount(prev => prev + 1);
      } else {
        // Reset retry counter on success
        setRetryCount(0);
      }

      setActivities(allActivities);
      setStats(getActivityStats(allActivities) as ActivityStats);
      return allActivities;
    } catch (error) {
      console.error('Error in fetchAllActivities:', error);
      // If this is the first error, show a toast
      if (retryCount === 0) {
        toast({
          title: "Connection issue",
          description: "We're having trouble loading activities. Retrying...",
          variant: "destructive",
        });
      }
      
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentUser, retryCount]);

  // Initial fetch and retry logic
  useEffect(() => {
    fetchAllActivities();
    
    // Set up retry logic if needed
    if (retryCount > 0 && retryCount < 3) {
      const retryTimer = setTimeout(() => {
        console.log(`Retrying activity fetch, attempt ${retryCount}`);
        fetchAllActivities();
      }, 3000 * retryCount); // Increasing backoff
      
      return () => clearTimeout(retryTimer);
    }
  }, [fetchAllActivities, retryCount]);

  return {
    activities,
    stats,
    loading,
    fetchAllActivities
  };
};
