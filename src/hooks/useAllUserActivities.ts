import { useState, useEffect, useRef } from 'react';
import { TransactionRecord } from '@/types/auth';
import { Activity, mapTransactionToActivity } from '@/components/home/ActivityFeed';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/components/ui/use-toast';

export interface ActivityStats {
  todayDeposits: number;
  todayWithdrawals: number;
}

export const useAllUserActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ActivityStats>({
    todayDeposits: 0,
    todayWithdrawals: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const prevActivitiesRef = useRef<Activity[]>([]);
  const lastFetchRef = useRef<Date>(new Date());
  const retryTimeoutRef = useRef<number | null>(null);

  // Function to get device information safely
  const getDeviceInfo = () => {
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
  
  const getTransactionsFromSupabase = async (): Promise<TransactionRecord[]> => {
    try {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select(`
          *,
          users:user_id (username)
        `)
        .order('timestamp', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      if (!transactions || transactions.length === 0) {
        return [];
      }
      
      // Map the Supabase result to our TransactionRecord format
      return transactions.map(t => {
        const deviceInfo = getDeviceInfo();
        
        return {
          id: t.id,
          type: t.type as any,
          amount: t.amount,
          timestamp: t.timestamp,
          status: t.status as any,
          details: t.details,
          userId: t.user_id,
          userName: t.users?.username || 'Unknown',
          deviceType: deviceInfo.type,
          deviceOS: deviceInfo.os,
          deviceLocation: deviceInfo.location,
          withdrawalTime: t.withdrawal_time,
          approvedBy: t.approved_by,
          approvalTimestamp: t.approval_timestamp,
          productId: t.product_id,
          productName: t.product_name
        };
      });
    } catch (error) {
      console.error("Error fetching from Supabase:", error);
      // Fall back to localStorage
      return getTransactionsFromLocalStorage();
    }
  };
  
  // Keep the localStorage function as fallback
  const getTransactionsFromLocalStorage = (): TransactionRecord[] => {
    // Get all users from localStorage
    const storedUsers = localStorage.getItem('investmentUsers');
    const currentUser = localStorage.getItem('investmentUser');
    
    let allUsers = [];
    
    // Parse stored users if available
    if (storedUsers) {
      allUsers = JSON.parse(storedUsers);
    }
    
    // Add current user if available and not already in the list
    if (currentUser) {
      const parsedUser = JSON.parse(currentUser);
      if (!allUsers.some(u => u.id === parsedUser.id)) {
        allUsers.push(parsedUser);
      }
    }
    
    // Extract all transactions with user information
    const allTransactions: TransactionRecord[] = [];
    
    allUsers.forEach(user => {
      if (user.transactions && user.transactions.length > 0) {
        // Add user information to each transaction
        const userTransactions = user.transactions.map(transaction => {
          const deviceInfo = getDeviceInfo();
          
          return {
            ...transaction,
            userId: user.id,
            userName: user.username,
            deviceType: deviceInfo.type,
            deviceOS: deviceInfo.os,
            deviceLocation: deviceInfo.location
          };
        });
        
        allTransactions.push(...userTransactions);
      }
    });
    
    return allTransactions;
  };

  const fetchActivities = async (forceRefresh = false) => {
    try {
      // If it's been less than 3 seconds since last fetch and not forced, skip
      const now = new Date();
      if (!forceRefresh && 
          now.getTime() - lastFetchRef.current.getTime() < 3000) {
        return;
      }
      
      lastFetchRef.current = now;
      
      if (!loading && !forceRefresh) {
        setLoading(true);
      }
      
      // Try to fetch from Supabase first, fall back to localStorage if needed
      const allTransactions = await getTransactionsFromSupabase();
      
      // Filter transactions to show only deposits, withdrawals, and purchases
      const filteredTransactions = allTransactions.filter(
        transaction => ['deposit', 'withdraw', 'purchase', 'sale', 'dailyIncome', 'referralBonus'].includes(transaction.type)
      );
      
      // Sort transactions by timestamp, newest first
      const sortedTransactions = filteredTransactions.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Map transactions to activities
      const mappedActivities = sortedTransactions.map(mapTransactionToActivity);
      
      // Calculate today's stats
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

      setStats({
        todayDeposits,
        todayWithdrawals
      });
      
      // Compare with previous activities to avoid unnecessary re-renders
      const prevActivities = prevActivitiesRef.current;
      
      if (mappedActivities.length !== prevActivities.length || 
          JSON.stringify(mappedActivities.map(a => a.id)) !== JSON.stringify(prevActivities.map(a => a.id))) {
        setActivities(mappedActivities);
        prevActivitiesRef.current = mappedActivities;
      }
      
      if (error) setError(null); // Clear any previous errors
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch activities'));
      setLoading(false);
      
      // Show error notification only on forced refreshes or initial load
      if (forceRefresh) {
        toast({
          title: "Error fetching activities",
          description: "Please try again later",
          variant: "destructive"
        });
      }
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchActivities(true);
    
    // Set up a refresh interval every 5 seconds (less frequent to reduce blink)
    const intervalId = setInterval(() => fetchActivities(), 5000);
    
    // Add storage event listener for real-time updates across tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'investmentUsers' || event.key === 'investmentUser') {
        console.log('User data changed in another tab, refreshing activities');
        fetchActivities(true);
      }
    };
    
    // Listen for realtime updates from Supabase
    const channel = supabase
      .channel('public:transactions')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'transactions' 
      }, (payload) => {
        console.log('Supabase realtime update received:', payload);
        fetchActivities(true);
      })
      .subscribe(status => {
        console.log('Supabase channel status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to realtime updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to realtime updates');
          
          // If we can't subscribe to realtime updates, increase the polling frequency
          clearInterval(intervalId);
          const fastIntervalId = setInterval(() => fetchActivities(), 3000);
          
          return () => clearInterval(fastIntervalId);
        }
      });
    
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up intervals and event listeners on component unmount
    return () => {
      clearInterval(intervalId);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      window.removeEventListener('storage', handleStorageChange);
      supabase.removeChannel(channel);
    };
  }, []);
  
  return { 
    activities, 
    stats, 
    loading, 
    error, 
    refresh: () => fetchActivities(true) 
  };
};
