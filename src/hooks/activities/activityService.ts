
import { Activity, ActivityType, ActivitySummary } from '@/types/activity';
import { User, TransactionRecord } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { formatTimeAgo, formatRelativeTime } from '@/utils/timeUtils';
import { mapTransactionToActivityType, mapTransactionTypeToIcon } from './activityUtils';

// Fetch activity logs from Supabase
const getActivityLogsFromSupabase = async (userId: string | undefined): Promise<Activity[]> => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching activity logs:', error);
      return [];
    }

    // Map to Activity format
    return data.map((log): Activity => ({
      id: log.id,
      type: log.activity_type as ActivityType,
      username: log.username || '',
      userId: log.user_id || '',
      timestamp: log.created_at,
      details: log.details || '',
      amount: log.amount || 0,
      iconName: mapTransactionTypeToIcon(log.activity_type),
      relativeTime: formatRelativeTime(new Date(log.created_at)),
      status: 'completed'
    }));
  } catch (error) {
    console.error('Error in getActivityLogsFromSupabase:', error);
    return [];
  }
};

// Fetch transactions from Supabase
const getTransactionsFromSupabase = async (userId: string | undefined): Promise<Activity[]> => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching from Supabase:', error);
      return [];
    }

    // Map to Activity format
    return data.map((tx): Activity => ({
      id: tx.id,
      type: mapTransactionToActivityType(tx.type),
      username: tx.approved_by || 'System',
      userId: tx.user_id || '',
      timestamp: tx.timestamp,
      details: tx.details || '',
      amount: tx.amount || 0,
      iconName: mapTransactionTypeToIcon(tx.type),
      relativeTime: formatRelativeTime(new Date(tx.timestamp)),
      status: tx.status
    }));
  } catch (error) {
    console.error('Error in getTransactionsFromSupabase:', error);
    return [];
  }
};

// Get activities from local storage transactions
const getActivitiesFromLocalStorage = (user: User | null): Activity[] => {
  if (!user || !user.transactions || user.transactions.length === 0) return [];

  return user.transactions.map((tx: TransactionRecord): Activity => ({
    id: tx.id,
    type: mapTransactionToActivityType(tx.type),
    username: tx.username || user.username,
    userId: tx.userId || user.id,
    timestamp: tx.timestamp,
    details: tx.details || '',
    amount: tx.amount,
    iconName: mapTransactionTypeToIcon(tx.type),
    relativeTime: formatRelativeTime(new Date(tx.timestamp)),
    status: tx.status
  }));
};

// Get activity statistics
export const getActivityStats = (activities: Activity[]): ActivitySummary => {
  const stats: ActivitySummary = {
    totalDeposits: 0,
    totalWithdraws: 0,
    totalProducts: 0,
    lastActive: '',
    todayDeposits: 0,
    todayWithdrawals: 0,
  };

  if (!activities.length) return stats;

  // Get last activity timestamp
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  stats.lastActive = sortedActivities[0].relativeTime || formatTimeAgo(sortedActivities[0].timestamp);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Count activities by type
  activities.forEach((activity) => {
    const activityDate = new Date(activity.timestamp);
    const isToday = activityDate >= today;

    switch (activity.type) {
      case 'deposit':
        stats.totalDeposits++;
        if (isToday) stats.todayDeposits!++;
        break;
      case 'withdraw':
        stats.totalWithdraws++;
        if (isToday) stats.todayWithdrawals!++;
        break;
      case 'investment':
      case 'purchase':
        stats.totalProducts++;
        break;
      default:
        break;
    }
  });

  return stats;
};

// Main function to fetch all activities
export const fetchActivities = async (user: User | null): Promise<Activity[]> => {
  try {
    let mergedActivities: Activity[] = [];

    // Get activities from Supabase
    if (user) {
      // Try to get activity logs
      const activityLogs = await getActivityLogsFromSupabase(user.id);
      mergedActivities = [...mergedActivities, ...activityLogs];

      // Try to get transaction records
      const transactionActivities = await getTransactionsFromSupabase(user.id);
      mergedActivities = [...mergedActivities, ...transactionActivities];
    }

    // Fallback to localStorage if no Supabase data or in offline mode
    if (mergedActivities.length === 0 && user) {
      const localActivities = getActivitiesFromLocalStorage(user);
      mergedActivities = [...mergedActivities, ...localActivities];
    }

    // Sort by timestamp (newest first)
    return mergedActivities.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};
