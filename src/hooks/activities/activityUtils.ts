
import { Activity } from '@/components/home/ActivityFeed';
import { TransactionRecord } from '@/types/auth';

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

// Calculate today's statistics from transactions
export const calculateActivityStats = (filteredTransactions: TransactionRecord[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayTransactions = filteredTransactions.filter(
    transaction => new Date(transaction.timestamp) >= today
  );

  const todayDeposits = todayTransactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const todayWithdrawals = todayTransactions
    .filter(t => t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
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
