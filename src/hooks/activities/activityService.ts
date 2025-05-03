
import { supabase } from "@/integrations/supabase/client";
import { TransactionRecord } from '@/types/auth';
import { getDeviceInfo } from './activityUtils';

// Function to fetch transactions from Supabase
export const getTransactionsFromSupabase = async (): Promise<TransactionRecord[]> => {
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

// Function to fetch transactions from localStorage (fallback)
export const getTransactionsFromLocalStorage = (): TransactionRecord[] => {
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
