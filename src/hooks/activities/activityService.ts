
import { Activity, ActivityType } from '@/types/activity';
import { ActivitySummary } from '@/types/activity';
import { User, TransactionRecord } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { formatTimeAgo } from '@/utils/timeUtils';
import { mapTransactionToActivityType, mapTransactionTypeToIcon } from './activityUtils';
import { getActivityDescription } from './activityUtils';

// Fetch activities for a user from Supabase
export const fetchActivities = async (user: User | null): Promise<Activity[]> => {
  if (!user) return [];
  
  try {
    const activities: Activity[] = [];
    
    // Fetch user's transactions
    const { data: transactionData, error: transactionError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });
      
    if (transactionError) {
      console.error('Error fetching transactions:', transactionError);
    } else if (transactionData) {
      // Map transactions to activities
      const transactionActivities: Activity[] = transactionData.map(tx => ({
        id: tx.id,
        username: user.username,
        userId: user.id,
        amount: tx.amount,
        type: mapTransactionToActivityType(tx.type),
        timestamp: tx.timestamp,
        details: tx.details || getActivityDescription(mapTransactionToActivityType(tx.type)),
        status: tx.status,
        bankDetails: tx.bank_details_id ? user.bankDetails : undefined,
        productName: tx.product_name,
        relativeTime: formatTimeAgo(tx.timestamp),
        iconName: mapTransactionTypeToIcon(tx.type)
      }));
      activities.push(...transactionActivities);
    }
    
    // Fetch user's activity logs
    const { data: activityLogs, error: logsError } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (logsError) {
      console.error('Error fetching activity logs:', logsError);
    } else if (activityLogs) {
      // Map activity logs to activities
      const logActivities: Activity[] = activityLogs.map(log => {
        const actType = log.activity_type as ActivityType;
        return {
          id: log.id,
          username: log.username,
          userId: user.id,
          amount: log.amount || 0,
          type: actType,
          timestamp: log.created_at,
          details: log.details || getActivityDescription(actType),
          status: 'completed',
          relativeTime: formatTimeAgo(log.created_at),
          iconName: mapTransactionTypeToIcon(log.activity_type)
        };
      });
      activities.push(...logActivities);
    }
    
    // Sort by timestamp (newest first) and add relative time
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .map(activity => ({
        ...activity,
        relativeTime: formatTimeAgo(activity.timestamp)
      }));
      
  } catch (error) {
    console.error('Error in fetchActivities:', error);
    return [];
  }
};

// Calculate activity statistics
export const getActivityStats = (activities: Activity[]): ActivitySummary => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let lastActive = '';
  if (activities.length > 0) {
    lastActive = formatTimeAgo(activities[0].timestamp);
  }
  
  let totalDeposits = 0;
  let totalWithdraws = 0;
  let totalProducts = 0;
  let todayDeposits = 0;
  let todayWithdrawals = 0;
  
  activities.forEach(activity => {
    if (activity.type === 'deposit') {
      totalDeposits++;
      
      // Check if this deposit was made today
      const activityDate = new Date(activity.timestamp);
      if (activityDate >= today) {
        todayDeposits++;
      }
    } else if (activity.type === 'withdraw') {
      totalWithdraws++;
      
      // Check if this withdrawal was made today
      const activityDate = new Date(activity.timestamp);
      if (activityDate >= today) {
        todayWithdrawals++;
      }
    } else if (activity.type === 'investment' || activity.type === 'purchase') {
      totalProducts++;
    }
  });
  
  return {
    totalDeposits,
    totalWithdraws,
    totalProducts,
    lastActive,
    todayDeposits,
    todayWithdrawals
  };
};
