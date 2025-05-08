
export interface UserActivity {
  id: string;
  activity_type: string;
  username: string;
  user_id?: string;
  details?: string;
  created_at: string;
  amount?: number;
  ip_address?: string;
}

export interface TransactionSummary {
  user_id: string;
  username: string;
  email: string;
  total_deposits: number;
  total_withdrawals: number;
  deposit_count: number;
  withdrawal_count: number;
  last_transaction_date: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at?: string;
}
