
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserActivity, TransactionSummary } from "@/types/admin";

interface SummaryStats {
  totalDeposits: number;
  totalWithdrawals: number;
  totalUsers: number;
  activeUsers: number;
}

interface ChartDataPoint {
  date: string;
  deposits: number;
  withdrawals: number;
}

interface DashboardData {
  transactions: any[];
  activities: UserActivity[];
  stats: TransactionSummary[];
  chartData: ChartDataPoint[];
  summaryStats: SummaryStats;
  loading: boolean;
  fetchData: () => Promise<void>;
  setupRealtimeSubscription: () => (() => void);
}

export const useDashboardData = (): DashboardData => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [stats, setStats] = useState<TransactionSummary[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [summaryStats, setSummaryStats] = useState<SummaryStats>({
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalUsers: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch transactions
  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching transactions:", error);
    } else {
      setTransactions(data || []);
    }
  };

  // Fetch activities
  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching activities:", error);
    } else {
      setActivities(data as UserActivity[] || []);
    }
  };

  // Fetch user stats
  const fetchUserStats = async () => {
    try {
      // Use RPC to fetch data from the view
      const { data, error } = await supabase.rpc('get_admin_transaction_summary');
      
      if (error) {
        console.error("Error fetching admin transaction summary:", error);
        
        // Fallback approach: create a manual summary from transactions
        console.log("Using fallback approach to generate transaction summary");
        
        // Get all users
        const { data: users } = await supabase.from('users').select('*');
        
        if (users) {
          // Get all transactions
          const { data: transactions } = await supabase.from('transactions').select('*');
          
          if (transactions) {
            // Manually calculate summary stats for each user
            const summaryData = users.map(user => {
              const userTransactions = transactions.filter(t => t.user_id === user.id);
              const deposits = userTransactions.filter(t => t.type === 'deposit');
              const withdrawals = userTransactions.filter(t => t.type === 'withdraw');
              
              const summary: TransactionSummary = {
                user_id: user.id,
                username: user.username,
                email: user.email,
                total_deposits: deposits.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
                total_withdrawals: withdrawals.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
                deposit_count: deposits.length,
                withdrawal_count: withdrawals.length,
                last_transaction_date: userTransactions.length > 0 ? 
                  userTransactions.sort((a, b) => 
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                  )[0].timestamp : null
              };
              
              return summary;
            });
            
            setStats(summaryData);
          }
        }
      } else {
        setStats(data as TransactionSummary[] || []);
      }
    } catch (error) {
      console.error("Error in fetchUserStats:", error);
    }
  };

  // Fetch summary stats
  const fetchSummaryStats = async () => {
    try {
      // Get total users
      const { count: userCount, error: userError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get active users (users who logged in in the last 7 days)
      const { count: activeCount, error: activeError } = await supabase
        .from('activity_logs')
        .select('*', { count: 'exact', head: true })
        .eq('activity_type', 'login')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Get total deposits
      const { data: deposits, error: depositError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'deposit')
        .eq('status', 'completed');
        
      // Get total withdrawals
      const { data: withdrawals, error: withdrawalError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'withdraw')
        .eq('status', 'completed');

      if (userError || activeError || depositError || withdrawalError) {
        throw new Error("Error fetching summary stats");
      }

      const totalDeposits = deposits ? 
        deposits.reduce((sum, t) => sum + (parseFloat(t.amount.toString()) || 0), 0) : 0;
        
      const totalWithdrawals = withdrawals ? 
        withdrawals.reduce((sum, t) => sum + (parseFloat(t.amount.toString()) || 0), 0) : 0;

      setSummaryStats({
        totalUsers: userCount || 0,
        activeUsers: activeCount || 0,
        totalDeposits,
        totalWithdrawals,
      });
    } catch (error) {
      console.error("Error fetching summary stats:", error);
    }
  };

  // Generate chart data based on transactions
  const generateChartData = () => {
    // Group transactions by date and calculate daily deposits/withdrawals
    const last30Days = new Array(30).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyData = last30Days.map(date => {
      const dayTransactions = transactions.filter(t => 
        t.timestamp && t.timestamp.split('T')[0] === date
      );
      
      const deposits = dayTransactions
        .filter(t => t.type === 'deposit' && t.status === 'completed')
        .reduce((sum, t) => sum + (parseFloat(t.amount.toString()) || 0), 0);
        
      const withdrawals = dayTransactions
        .filter(t => t.type === 'withdraw' && t.status === 'completed')
        .reduce((sum, t) => sum + (parseFloat(t.amount.toString()) || 0), 0);
        
      return {
        date,
        deposits,
        withdrawals
      };
    });

    setChartData(dailyData);
  };

  // Initial data fetching
  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchTransactions(),
        fetchActivities(),
        fetchUserStats(),
        fetchSummaryStats()
      ]);

      // Generate chart data
      generateChartData();
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Set up realtime subscription
  const setupRealtimeSubscription = () => {
    const transactionsChannel = supabase
      .channel('admin-transaction-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transactions'
      }, async () => {
        console.log('Realtime transaction update detected');
        await fetchTransactions();
        await fetchSummaryStats();
        generateChartData();
      })
      .subscribe();

    const activitiesChannel = supabase
      .channel('admin-activity-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'activity_logs'
      }, async () => {
        console.log('Realtime activity update detected');
        await fetchActivities();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(transactionsChannel);
      supabase.removeChannel(activitiesChannel);
    };
  };

  // Use effect for initial data fetch
  useEffect(() => {
    fetchData();
    // No need to call setupRealtimeSubscription() here as it will be called by the component
  }, []);

  return {
    transactions,
    activities,
    stats,
    chartData,
    summaryStats,
    loading,
    fetchData,
    setupRealtimeSubscription
  };
};
