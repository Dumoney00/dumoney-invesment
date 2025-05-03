
import { User, TransactionRecord } from "@/types/auth";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export const createMockUser = (
  username: string, 
  email: string,
  phone: string
): User => {
  return {
    id: uuidv4(),
    username,
    email,
    phone,
    balance: 0,
    withdrawalBalance: 0,
    totalDeposit: 0,
    totalWithdraw: 0,
    dailyIncome: 0,
    investmentQuantity: 0,
    ownedProducts: [],
    transactions: []
  };
};

export const generateTransactionId = (): string => {
  return uuidv4();
};

export const createTransactionRecord = (
  transactionData: Omit<TransactionRecord, "id" | "timestamp">
): TransactionRecord => {
  return {
    id: generateTransactionId(),
    timestamp: new Date().toISOString(),
    ...transactionData
  };
};

export const loadUserFromStorage = async (): Promise<User | null> => {
  // Try to get user from Supabase first
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (authUser) {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
        
      if (error) {
        console.error("Error loading user from Supabase:", error);
        // Fall back to localStorage if needed
        const storedUser = localStorage.getItem('investmentUser');
        return storedUser ? JSON.parse(storedUser) : null;
      }
      
      if (userData) {
        // Transform to our User type
        const user: User = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
          balance: userData.balance,
          withdrawalBalance: userData.withdrawal_balance,
          totalDeposit: userData.total_deposit,
          totalWithdraw: userData.total_withdraw,
          dailyIncome: userData.daily_income,
          investmentQuantity: userData.investment_quantity,
          ownedProducts: userData.owned_products,
          transactions: [],  // We'll load these separately
          lastIncomeCollection: userData.last_income_collection,
          isAdmin: userData.is_admin,
          isBlocked: userData.is_blocked,
          referralCode: userData.referral_code,
          referralStatus: userData.referral_status as 'pending' | 'approved' | undefined,
          referredBy: userData.referred_by,
          level: userData.level,
          bankDetails: userData.bank_details,
          upiId: userData.upi_id
        };
        
        // Get user transactions
        const { data: transactionsData, error: transError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false });
          
        if (transError) {
          console.error("Error loading transactions:", transError);
        } else {
          user.transactions = transactionsData.map(t => ({
            id: t.id,
            type: t.type as any,
            amount: t.amount,
            timestamp: t.timestamp,
            status: t.status as any,
            details: t.details,
            userId: t.user_id,
            bankDetails: t.bank_details_id ? {
              accountNumber: "",  // We'd need to fetch this from bank_details table
              ifscCode: "", 
              accountHolderName: ""
            } : undefined,
            withdrawalTime: t.withdrawal_time,
            approvedBy: t.approved_by,
            approvalTimestamp: t.approval_timestamp,
            productId: t.product_id,
            productName: t.product_name
          }));
        }
        
        return user;
      }
    }
    
    // Fall back to localStorage if no Supabase user
    const storedUser = localStorage.getItem('investmentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error in loadUserFromStorage:", error);
    // Fall back to localStorage
    const storedUser = localStorage.getItem('investmentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }
};

export const saveUserToStorage = async (user: User | null): Promise<void> => {
  if (user) {
    // Update user in Supabase if possible
    try {
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          balance: user.balance,
          withdrawal_balance: user.withdrawalBalance,
          total_deposit: user.totalDeposit,
          total_withdraw: user.totalWithdraw,
          daily_income: user.dailyIncome,
          investment_quantity: user.investmentQuantity,
          owned_products: user.ownedProducts || [],
          last_income_collection: user.lastIncomeCollection,
          is_admin: user.isAdmin || false,
          is_blocked: user.isBlocked || false,
          referral_code: user.referralCode,
          referral_status: user.referralStatus,
          referred_by: user.referredBy,
          level: user.level,
          bank_details: user.bankDetails,
          upi_id: user.upiId
        }, { onConflict: 'id' });
        
      if (userError) {
        console.error("Error saving user to Supabase:", userError);
      }
    } catch (error) {
      console.error("Failed to save user to Supabase:", error);
    }
    
    // Still save to localStorage as backup
    localStorage.setItem('investmentUser', JSON.stringify(user));
    
    // Update users array in localStorage too
    const storedUsers = localStorage.getItem('investmentUsers');
    let users = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Check if user already exists
    const existingUserIndex = users.findIndex((u: User) => u.id === user.id);
    
    if (existingUserIndex >= 0) {
      // Update existing user
      users[existingUserIndex] = user;
    } else {
      // Add new user
      users.push(user);
    }
    
    // Save updated users array
    localStorage.setItem('investmentUsers', JSON.stringify(users));
  } else {
    localStorage.removeItem('investmentUser');
  }
};

export const checkExistingUser = async (email: string, phone: string): Promise<boolean> => {
  try {
    // Check if user exists in Supabase
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},phone.eq.${phone}`);
      
    if (error) {
      console.error("Error checking existing user:", error);
      // Fall back to localStorage
      const storedUsers = localStorage.getItem('investmentUsers');
      if (!storedUsers) return false;
      
      const users: User[] = JSON.parse(storedUsers);
      return users.some(user => user.email === email || user.phone === phone);
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error("Error in checkExistingUser:", error);
    // Fall back to localStorage
    const storedUsers = localStorage.getItem('investmentUsers');
    if (!storedUsers) return false;
    
    const users: User[] = JSON.parse(storedUsers);
    return users.some(user => user.email === email || user.phone === phone);
  }
};

export const findUserByEmailOrPhone = async (emailOrPhone: string): Promise<User | null> => {
  try {
    // Try to find user in Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${emailOrPhone},phone.eq.${emailOrPhone}`);
      
    if (error) {
      console.error("Error finding user:", error);
      // Fall back to localStorage
      const storedUsers = localStorage.getItem('investmentUsers');
      if (!storedUsers) return null;
      
      const users: User[] = JSON.parse(storedUsers);
      return users.find(user => user.email === emailOrPhone || user.phone === emailOrPhone) || null;
    }
    
    if (data && data.length > 0) {
      // Format data from Supabase to match User type
      return {
        id: data[0].id,
        username: data[0].username,
        email: data[0].email,
        phone: data[0].phone,
        balance: data[0].balance,
        withdrawalBalance: data[0].withdrawal_balance,
        totalDeposit: data[0].total_deposit,
        totalWithdraw: data[0].total_withdraw,
        dailyIncome: data[0].daily_income,
        investmentQuantity: data[0].investment_quantity,
        ownedProducts: data[0].owned_products,
        transactions: [], // We'd need to load these separately if needed
        lastIncomeCollection: data[0].last_income_collection,
        isAdmin: data[0].is_admin,
        isBlocked: data[0].is_blocked,
        referralCode: data[0].referral_code,
        referralStatus: data[0].referral_status as 'pending' | 'approved' | undefined,
        referredBy: data[0].referred_by,
        level: data[0].level,
        bankDetails: data[0].bank_details,
        upiId: data[0].upi_id
      };
    }
    
    // Fall back to localStorage
    const storedUsers = localStorage.getItem('investmentUsers');
    if (!storedUsers) return null;
    
    const users: User[] = JSON.parse(storedUsers);
    return users.find(user => user.email === emailOrPhone || user.phone === emailOrPhone) || null;
  } catch (error) {
    console.error("Error in findUserByEmailOrPhone:", error);
    // Fall back to localStorage
    const storedUsers = localStorage.getItem('investmentUsers');
    if (!storedUsers) return null;
    
    const users: User[] = JSON.parse(storedUsers);
    return users.find(user => user.email === emailOrPhone || user.phone === emailOrPhone) || null;
  }
};

export const showToast = (
  title: string,
  description: string,
  variant?: "default" | "destructive"
): void => {
  toast({
    title,
    description,
    variant
  });
};
