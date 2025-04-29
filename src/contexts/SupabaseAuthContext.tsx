import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { showToast } from '@/utils/toastUtils';

type SupabaseAuthContextType = {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, phone: string, password: string, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>;
  isAdmin: boolean;
};

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Convert Supabase user data to our User type
  const formatUserData = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    if (!supabaseUser) return null;

    // Fetch user profile data from our users table
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return null;
    }

    if (!userData) return null;

    // Return formatted user data
    return {
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
      ownedProducts: [], // These will need to be fetched separately if needed
      transactions: [], // These will need to be fetched separately if needed
      lastIncomeCollection: userData.last_income_collection,
      isAdmin: userData.is_admin,
      isBlocked: userData.is_blocked,
      referralCode: userData.referral_code,
      referralStatus: userData.referral_status as "pending" | "approved" | undefined,
      referredBy: userData.referred_by,
      level: userData.level
    };
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user) {
        setSupabaseUser(session.user);
        const formattedUser = await formatUserData(session.user);
        setUser(formattedUser);
        setIsAdmin(formattedUser?.isAdmin || false);
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        
        if (session?.user) {
          setSupabaseUser(session.user);
          const formattedUser = await formatUserData(session.user);
          setUser(formattedUser);
          setIsAdmin(formattedUser?.isAdmin || false);
        } else {
          setSupabaseUser(null);
          setUser(null);
          setIsAdmin(false);
        }
        
        setIsLoading(false);
      }
    );

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Login error:", error);
        showToast("Login Failed", error.message, "destructive");
        return false;
      }

      if (data.user) {
        showToast("Login Successful", "Welcome back!");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login exception:", error);
      showToast("Login Failed", "An unexpected error occurred", "destructive");
      return false;
    }
  };

  // Register function
  const register = async (
    username: string,
    email: string,
    phone: string,
    password: string,
    referralCode?: string
  ): Promise<boolean> => {
    try {
      // We need to pass the username and phone in the user metadata
      // so our trigger function can create the user profile
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            phone
          },
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        console.error("Registration error:", error);
        showToast("Registration Failed", error.message, "destructive");
        return false;
      }

      if (data.user) {
        // If referral code was provided, update the user profile
        if (referralCode) {
          await supabase
            .from('users')
            .update({
              referral_code: referralCode,
              referral_status: 'pending'
            })
            .eq('id', data.user.id);
        }

        // Track user registration in transactions for admin dashboard
        await supabase
          .from('transactions')
          .insert({
            user_id: data.user.id,
            type: 'account_created',
            amount: 0,
            status: 'completed',
            details: `New user registered with username: ${username}`
          });

        showToast("Registration Successful", "Your account has been created");
        
        // Auto-login the user after registration
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (loginError) {
          console.error("Auto-login error:", loginError);
          showToast("Auto-login Failed", "Please log in manually", "destructive");
        }
        
        return true;
      }

      return false;
    } catch (error) {
      console.error("Registration exception:", error);
      showToast("Registration Failed", "An unexpected error occurred", "destructive");
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    if (user) {
      // Track user logout in transactions for admin dashboard
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'account_activity',
          amount: 0,
          status: 'completed',
          details: `User logged out: ${user.username}`
        });
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      showToast("Logout Failed", error.message, "destructive");
    } else {
      showToast("Logged Out", "You have been logged out successfully");
    }
  };

  // Update user profile
  const updateUserProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      // Convert our User type properties to match database column names
      const dbUpdates = {
        ...(updates.username && { username: updates.username }),
        ...(updates.phone && { phone: updates.phone }),
        ...(updates.balance !== undefined && { balance: updates.balance }),
        ...(updates.withdrawalBalance !== undefined && { withdrawal_balance: updates.withdrawalBalance }),
        ...(updates.totalDeposit !== undefined && { total_deposit: updates.totalDeposit }),
        ...(updates.totalWithdraw !== undefined && { total_withdraw: updates.totalWithdraw }),
        ...(updates.dailyIncome !== undefined && { daily_income: updates.dailyIncome }),
        ...(updates.investmentQuantity !== undefined && { investment_quantity: updates.investmentQuantity }),
        ...(updates.lastIncomeCollection && { last_income_collection: updates.lastIncomeCollection }),
        ...(updates.referralCode && { referral_code: updates.referralCode }),
        ...(updates.referralStatus && { referral_status: updates.referralStatus }),
        ...(updates.level !== undefined && { level: updates.level })
      };

      const { error } = await supabase
        .from('users')
        .update(dbUpdates)
        .eq('id', user.id);

      if (error) {
        console.error("Error updating user profile:", error);
        showToast("Update Failed", error.message, "destructive");
        return false;
      }

      // Track profile updates in transactions for admin dashboard
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'account_update',
          amount: 0,
          status: 'completed',
          details: `Profile updated: ${Object.keys(updates).join(', ')}`
        });

      // Update our local user state with the updates
      setUser(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (error) {
      console.error("Error updating user profile:", error);
      showToast("Update Failed", "An unexpected error occurred", "destructive");
      return false;
    }
  };

  // Provide auth context
  const value = {
    user,
    supabaseUser,
    session,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUserProfile,
    isAdmin
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};
