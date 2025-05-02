
import { useState, useEffect, useRef } from 'react';
import { TransactionRecord, User } from '@/types/auth';
import { Activity, mapTransactionToActivity } from '@/components/home/ActivityFeed';
import { supabase } from "@/integrations/supabase/client";

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

  const fetchActivities = async () => {
    try {
      if (loading) {
        setLoading(true);
      }
      
      // First try to get activities from Supabase if available
      let allTransactions: TransactionRecord[] = [];
      
      try {
        // Try to fetch from Supabase first
        const { data: supabaseTransactions, error: supabaseError } = await supabase
          .from('transactions')
          .select('*')
          .order('timestamp', { ascending: false });
          
        if (supabaseError) {
          console.error("Error fetching from Supabase:", supabaseError);
          // Fall back to localStorage if Supabase fails
          allTransactions = getTransactionsFromLocalStorage();
        } else if (supabaseTransactions && supabaseTransactions.length > 0) {
          // Use Supabase data if available
          allTransactions = supabaseTransactions as TransactionRecord[];
          console.log("Fetched transactions from Supabase:", allTransactions.length);
        } else {
          // Fall back to localStorage if no data in Supabase
          allTransactions = getTransactionsFromLocalStorage();
        }
      } catch (e) {
        console.error("Supabase fetch failed, using localStorage:", e);
        // Fall back to localStorage
        allTransactions = getTransactionsFromLocalStorage();
      }
      
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
      const hasChanged = mappedActivities.length !== prevActivities.length || 
        JSON.stringify(mappedActivities.map(a => a.id)) !== JSON.stringify(prevActivities.map(a => a.id));
      
      if (hasChanged) {
        setActivities(mappedActivities);
        prevActivitiesRef.current = mappedActivities;
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch activities'));
      setLoading(false);
    }
  };
  
  // Helper function to get transactions from localStorage
  const getTransactionsFromLocalStorage = (): TransactionRecord[] => {
    // Get all users from localStorage
    const storedUsers = localStorage.getItem('investmentUsers');
    const currentUser = localStorage.getItem('investmentUser');
    
    let allUsers: User[] = [];
    
    // Parse stored users if available
    if (storedUsers) {
      allUsers = JSON.parse(storedUsers);
    }
    
    // Add current user if available and not already in the list
    if (currentUser) {
      const parsedUser = JSON.parse(currentUser) as User;
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
          // Get device info from local storage if available
          const deviceInfo = {
            type: navigator.userAgent.indexOf('Mobile') > -1 ? 'Mobile' : 'Desktop',
            os: navigator.platform,
            location: 'Local'
          };
          
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

  useEffect(() => {
    fetchActivities();
    
    // Set up a refresh interval every 10 seconds (less frequent to reduce blink)
    const intervalId = setInterval(fetchActivities, 10000);
    
    // Add storage event listener for real-time updates across tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'investmentUsers' || event.key === 'investmentUser') {
        console.log('User data changed in another tab, refreshing activities');
        fetchActivities();
      }
    };
    
    // Listen for realtime updates from Supabase
    const channel = supabase
      .channel('public:transactions')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'transactions' 
      }, () => {
        console.log('Supabase realtime update received, refreshing activities');
        fetchActivities();
      })
      .subscribe();
    
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up intervals and event listeners on component unmount
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
      supabase.removeChannel(channel);
    };
  }, []);
  
  return { activities, stats, loading, error };
};
