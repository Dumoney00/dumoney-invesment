
import { useState, useCallback } from 'react';
import { Activity } from '@/types/activity';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { getActivityStats } from './activityService';
import { ActivityStats } from './types';

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

  const fetchAllActivities = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching all activities, currentUser:', currentUser?.id);
      // For admin users, fetch activities for all users from Supabase
      let allActivities: Activity[] = [];

      // First fetch transactions (for all users, but limit scope if not admin)
      const transactionQuery = supabase
        .from('transactions')
        .select('*')
        .order('timestamp', { ascending: false });
      
      // Only filter by user_id if not an admin user
      if (!currentUser?.isAdmin) {
        // Still fetch all transactions but limit to more recent ones for non-admins
        // This ensures we see everyone's public activity
        transactionQuery.limit(100);
      }
        
      const { data: transactionData, error: transactionError } = await transactionQuery;

      if (transactionError) {
        console.error('Error fetching all transactions:', transactionError);
      } else if (transactionData) {
        console.log(`Fetched ${transactionData.length} transactions`);
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

      // Now fetch activity logs
      const activityQuery = supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Only filter by user_id if not an admin user
      if (!currentUser?.isAdmin) {
        // Still fetch all activity logs but limit to more recent ones for non-admins
        activityQuery.limit(100);
      }
        
      const { data: activityData, error: activityError } = await activityQuery;

      if (activityError) {
        console.error('Error fetching all activity logs:', activityError);
      } else if (activityData) {
        console.log(`Fetched ${activityData.length} activity logs`);
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

      // Sort by timestamp (newest first)
      allActivities = allActivities.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      console.log(`Total activities after fetch: ${allActivities.length}`);
      setActivities(allActivities);
      setStats(getActivityStats(allActivities) as ActivityStats);
      return allActivities;
    } catch (error) {
      console.error('Error in fetchAllActivities:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  return {
    activities,
    stats,
    loading,
    fetchAllActivities
  };
};
