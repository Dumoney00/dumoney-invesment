
import { useEffect, useState } from 'react';
import { TransactionRecord, User } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAllUserTransactions = () => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all users from Supabase
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*');
      
      if (usersError) throw usersError;
      
      // Fetch all transactions from Supabase
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          *,
          users:user_id (username)
        `)
        .order('timestamp', { ascending: false });
      
      if (transactionsError) throw transactionsError;
      
      // Format users data to match our User type
      const formattedUsers: User[] = usersData.map((user: any) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        balance: user.balance,
        withdrawalBalance: user.withdrawal_balance,
        totalDeposit: user.total_deposit,
        totalWithdraw: user.total_withdraw,
        dailyIncome: user.daily_income,
        investmentQuantity: user.investment_quantity,
        ownedProducts: [], // Empty array as default
        transactions: [], // Empty array as default
        lastIncomeCollection: user.last_income_collection,
        isAdmin: user.is_admin,
        isBlocked: user.is_blocked,
        referralCode: user.referral_code,
        referralStatus: user.referral_status as "pending" | "approved" | undefined,
        referredBy: user.referred_by,
        level: user.level
      }));
      
      // Format transactions data to match our TransactionRecord type
      const formattedTransactions: TransactionRecord[] = transactionsData.map((transaction: any) => ({
        id: transaction.id,
        type: transaction.type as any,
        amount: transaction.amount,
        timestamp: transaction.timestamp,
        status: transaction.status as any,
        details: transaction.details,
        userId: transaction.user_id,
        userName: transaction.users?.username || 'Unknown User',
        withdrawalTime: transaction.withdrawal_time,
        approvedBy: transaction.approved_by,
        approvalTimestamp: transaction.approval_timestamp,
        productId: transaction.product_id,
        productName: transaction.product_name
      }));
      
      setUsers(formattedUsers);
      setTransactions(formattedTransactions);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up real-time subscription for users table
    const usersSubscription = supabase
      .channel('public:users')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' }, 
        () => {
          console.log('Users table changed, refreshing data');
          fetchData();
        }
      )
      .subscribe();
    
    // Set up real-time subscription for transactions table
    const transactionsSubscription = supabase
      .channel('public:transactions')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'transactions' }, 
        () => {
          console.log('Transactions table changed, refreshing data');
          fetchData();
        }
      )
      .subscribe();
    
    // Clean up subscriptions on component unmount
    return () => {
      supabase.removeChannel(usersSubscription);
      supabase.removeChannel(transactionsSubscription);
    };
  }, []);
  
  return { transactions, users, loading, error, refreshData: fetchData };
};
