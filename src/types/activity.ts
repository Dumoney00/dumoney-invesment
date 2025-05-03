
import { TransactionRecord } from '@/types/auth';

export interface Activity {
  id: string;
  username: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdraw' | 'investment' | 'referral' | 'sale' | 'dailyIncome' | 'referralBonus';
  timestamp: string;
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
}

// Map transaction to activity
export const mapTransactionToActivity = (transaction: TransactionRecord): Activity => {
  // Map transaction type to activity type
  let activityType: Activity['type'];
  
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
      activityType = transaction.type as Activity['type'];
  }
  
  return {
    id: transaction.id,
    username: transaction.userName || 'Anonymous',
    userId: transaction.userId || 'unknown',
    amount: transaction.amount,
    type: activityType,
    timestamp: transaction.timestamp,
    bankDetails: transaction.bankDetails,
    productName: transaction.productName,
    deviceInfo: transaction.deviceInfo || {
      type: transaction.deviceType || 'Unknown',
      os: transaction.deviceOS || 'Unknown',
      location: transaction.deviceLocation
    }
  };
};
