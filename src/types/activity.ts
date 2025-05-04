
import { TransactionRecord } from '@/types/auth';

export type ActivityType = 'deposit' | 'withdraw' | 'investment' | 'referral' | 'sale' | 'dailyIncome' | 'referralBonus' | 'purchase' | 'login' | 'logout' | 'register' | 'other';

export interface Activity {
  id: string;
  username: string;
  userId: string;
  amount: number;
  type: ActivityType;
  timestamp: string;
  details?: string;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
  productName?: string;
  deviceInfo?: {
    type?: string;
    os?: string;
    location?: string;
  };
  relativeTime?: string;
  status?: string;
  iconName?: any;
}

// Make both interfaces consistent with required properties
export interface ActivitySummary {
  totalDeposits: number;
  totalWithdraws: number;
  totalProducts: number;
  lastActive: string;
  todayDeposits: number;
  todayWithdrawals: number;
}

// Map transaction to activity
export const mapTransactionToActivity = (transaction: TransactionRecord): Activity => {
  // Map transaction type to activity type
  let activityType: ActivityType;
  
  switch (transaction.type) {
    case 'purchase':
      activityType = 'investment';
      break;
    case 'referralBonus':
      activityType = 'referralBonus';
      break;
    case 'dailyIncome':
      activityType = 'dailyIncome';
      break;
    case 'sale':
      activityType = 'sale';
      break;
    default:
      activityType = transaction.type as ActivityType;
  }
  
  return {
    id: transaction.id,
    username: transaction.userName || 'Anonymous',
    userId: transaction.userId || 'unknown',
    amount: transaction.amount,
    type: activityType,
    timestamp: transaction.timestamp,
    details: transaction.details,
    bankDetails: transaction.bankDetails,
    productName: transaction.productName,
    deviceInfo: transaction.deviceInfo || {
      type: transaction.deviceType || 'Unknown',
      os: transaction.deviceOS || 'Unknown',
      location: transaction.deviceLocation
    },
    status: transaction.status
  };
};
