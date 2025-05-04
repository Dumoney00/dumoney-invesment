
import { Activity } from '@/types/activity';
import { TransactionRecord } from '@/types/auth';
import { ActivityStats } from './useActivities';

// Function to get device information safely
export const getDeviceInfo = () => {
  try {
    return {
      type: navigator.userAgent.indexOf('Mobile') > -1 ? 'Mobile' : 'Desktop',
      os: navigator.platform,
      location: 'Local'
    };
  } catch (e) {
    return { type: 'Unknown', os: 'Unknown', location: 'Unknown' };
  }
};

// Calculate statistics from activities
export const calculateActivityStats = (activities: Activity[]): ActivityStats => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayActivities = activities.filter(
    activity => new Date(activity.timestamp) >= today
  );
  
  const todayDeposits = todayActivities
    .filter(a => a.type === 'deposit')
    .reduce((sum, a) => sum + a.amount, 0);
    
  const todayWithdrawals = todayActivities
    .filter(a => a.type === 'withdraw')
    .reduce((sum, a) => sum + a.amount, 0);
    
  // Calculate total stats
  const uniqueUserIds = new Set(activities.map(a => a.userId));
  
  const deposits = activities.filter(a => a.type === 'deposit');
  const withdrawals = activities.filter(a => a.type === 'withdraw');
  const investments = activities.filter(a => a.type === 'investment');
  
  return {
    totalUsers: uniqueUserIds.size,
    totalAmount: activities.reduce((sum, a) => sum + a.amount, 0),
    deposits: {
      count: deposits.length,
      amount: deposits.reduce((sum, a) => sum + a.amount, 0)
    },
    withdrawals: {
      count: withdrawals.length,
      amount: withdrawals.reduce((sum, a) => sum + a.amount, 0)
    },
    investments: {
      count: investments.length,
      amount: investments.reduce((sum, a) => sum + a.amount, 0)
    },
    todayDeposits,
    todayWithdrawals
  };
};

// Compare activities arrays to see if they've changed
export const activitiesHaveChanged = (
  newActivities: Activity[], 
  prevActivities: Activity[]
) => {
  return newActivities.length !== prevActivities.length || 
    JSON.stringify(newActivities.map(a => a.id)) !== JSON.stringify(prevActivities.map(a => a.id));
};
