
import { useState, useEffect } from 'react';
import { Activity } from '@/types/activity';
import { ActivityStats } from '@/hooks/activities/types';
import { fetchActivities, getActivityStats } from '@/hooks/activities/activityService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAllUserActivities = () => {
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
  const { user: currentUser } = useAuth();

  const fetchAllActivities = async () => {
    setLoading(true);
    try {
      // For admin users, fetch activities for all users from Supabase
      let allActivities: Activity[] = [];

      if (currentUser?.isAdmin) {
        // Fetch all transactions
        const { data: transactionData, error: transactionError } = await supabase
          .from('transactions')
          .select('*')
          .order('timestamp', { ascending: false });

        if (transactionError) {
          console.error('Error fetching all transactions:', transactionError);
        } else if (transactionData) {
          // Map transaction data to activities
          const transactionActivities: Activity[] = transactionData.map((tx: any) => ({
            id: tx.id,
            type: tx.type === 'purchase' ? 'investment' : tx.type,
            username: tx.approved_by || 'System',
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
            productName: tx.product_name
          }));
          allActivities = [...allActivities, ...transactionActivities];
        }

        // Fetch all activity logs
        const { data: activityData, error: activityError } = await supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false });

        if (activityError) {
          console.error('Error fetching all activity logs:', activityError);
        } else if (activityData) {
          // Map activity logs to activities
          const logActivities: Activity[] = activityData.map((log: any) => ({
            id: log.id,
            type: log.activity_type,
            username: log.username,
            userId: log.user_id,
            timestamp: log.created_at,
            details: log.details || '',
            amount: log.amount || 0,
            status: 'completed',
            relativeTime: ''
          }));
          allActivities = [...allActivities, ...logActivities];
        }
      } else {
        // First fetch user's own activities
        const userActivities = await fetchActivities(currentUser);
        allActivities = [...allActivities, ...userActivities];
        
        // Then fetch all public activities from all users
        const { data: publicActivityData, error: publicActivityError } = await supabase
          .from('transactions')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(50);
        
        if (publicActivityError) {
          console.error('Error fetching public activities:', publicActivityError);
        } else if (publicActivityData) {
          // Map transaction data to activities
          const publicActivities: Activity[] = publicActivityData.map((tx: any) => ({
            id: tx.id,
            type: tx.type === 'purchase' ? 'investment' : tx.type,
            username: tx.approved_by || 'User',
            userId: tx.user_id,
            timestamp: tx.timestamp,
            details: tx.details || '',
            amount: tx.amount,
            status: tx.status,
            relativeTime: '',
            productName: tx.product_name
          }));
          
          // Combine and remove duplicates
          const combinedActivities = [...allActivities];
          publicActivities.forEach(activity => {
            if (!combinedActivities.some(a => a.id === activity.id)) {
              combinedActivities.push(activity);
            }
          });
          
          allActivities = combinedActivities;
        }
      }

      // Sort by timestamp (newest first)
      allActivities = allActivities.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setActivities(allActivities);
      setStats(getActivityStats(allActivities) as ActivityStats);
    } catch (error) {
      console.error('Error in fetchAllActivities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllActivities();
    
    // Subscribe to real-time updates
    const transactionsChannel = supabase
      .channel('transactions-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transactions'
      }, () => {
        console.log('Transaction change detected!');
        fetchAllActivities();
      })
      .subscribe();

    const activitiesChannel = supabase
      .channel('activities-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'activity_logs'
      }, () => {
        console.log('Activity log change detected!');
        fetchAllActivities();
      })
      .subscribe();

    // Set up a regular refresh interval
    const refreshInterval = setInterval(() => {
      fetchAllActivities();
    }, 15000); // Refresh every 15 seconds

    return () => {
      supabase.removeChannel(transactionsChannel);
      supabase.removeChannel(activitiesChannel);
      clearInterval(refreshInterval);
    };
  }, [currentUser]);

  const refresh = () => {
    return fetchAllActivities();
  };

  return {
    activities,
    stats,
    loading,
    refresh
  };
};
