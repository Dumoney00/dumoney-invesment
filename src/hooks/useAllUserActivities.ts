
import { useState, useEffect, useRef } from 'react';
import { TransactionRecord, User } from '@/types/auth';
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
      
      let allTransactions: TransactionRecord[] = [];
      
      try {
        // Try to fetch from Supabase first
        const { data: supabaseTransactions, error: supabaseError } = await supabase
          .from('transactions')
          .select('*')
          .order('timestamp', { ascending: false });
          
        if (supabaseError) {
          console.error("Error fetching from Supabase:", supabaseError);
          // Don't fall back to localStorage on every error, retry Supabase first
          if (supabaseError.code === '42P17') {
            // This is the infinite recursion error, let's handle it differently
            console.log("Handling infinite recursion error, using localStorage instead");
            allTransactions = getTransactionsFromLocalStorage();
            
            // Schedule a retry after 5 seconds
            if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = setTimeout(() => fetchActivities(true), 5000) as unknown as number;
          } else {
            throw supabaseError;
          }
        } else if (supabaseTransactions && supabaseTransactions.length > 0) {
          // Use Supabase data if available
          allTransactions = supabaseTransactions as TransactionRecord[];
          console.log("Successfully fetched transactions from Supabase:", allTransactions.length);
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
    
    // Manual refresh method accessible to components
    const manualRefresh = () => {
      fetchActivities(true);
    };
    
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
