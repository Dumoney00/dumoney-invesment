
import { Activity } from '@/types/activity';

export interface ActivityStats {
  totalDeposits: number;
  totalWithdraws: number;
  totalProducts: number;
  lastActive: string;
  todayDeposits: number;
  todayWithdrawals: number;
}

export interface ActivityHookResult {
  activities: Activity[];
  stats: ActivityStats;
  loading: boolean;
  refresh: () => Promise<void>;
}

export interface ActivityLoggerResult {
  logActivity: (
    activityType: string,
    details: string | null,
    amount: number | null
  ) => Promise<boolean>;
}
