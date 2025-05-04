
import { 
  CreditCard, 
  DollarSign, 
  ShoppingBag, 
  Info, 
  LogIn, 
  LogOut,
  UserPlus,
  Settings,
  Award
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { ActivityType } from '@/types/activity';

// Convert transaction type to activity type
export const mapTransactionToActivityType = (type: string): ActivityType => {
  switch (type) {
    case 'deposit': return 'deposit';
    case 'withdraw': return 'withdraw';
    case 'purchase': return 'purchase';
    case 'sale': return 'sale';
    case 'dailyIncome': return 'dailyIncome';
    case 'referralBonus': return 'referral';
    default: return 'other';
  }
};

// Map transaction types to icons
export const mapTransactionTypeToIcon = (type: string): LucideIcon => {
  switch (type) {
    case 'deposit':
      return CreditCard;
    case 'withdraw':
      return DollarSign;
    case 'purchase':
    case 'sale':
      return ShoppingBag;
    case 'dailyIncome':
    case 'income':
      return Award;
    case 'referralBonus':
    case 'referral':
      return Award;
    case 'login':
      return LogIn;
    case 'logout':
      return LogOut;
    case 'register':
      return UserPlus;
    case 'profile_update':
      return Settings;
    default:
      return Info;
  }
};

// Get activity description
export const getActivityDescription = (type: ActivityType): string => {
  switch (type) {
    case 'deposit':
      return 'Deposit to account';
    case 'withdraw':
      return 'Withdrawal from account';
    case 'purchase':
    case 'investment':
      return 'Product purchased';
    case 'sale':
      return 'Product sold';
    case 'dailyIncome':
      return 'Daily income earned';
    case 'referral':
    case 'referralBonus':
      return 'Referral bonus earned';
    case 'login':
      return 'User logged in';
    case 'logout':
      return 'User logged out';
    case 'register':
      return 'New account created';
    default:
      return 'Activity recorded';
  }
};
