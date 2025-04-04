import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  balance: number;
  totalDeposit: number;
  totalWithdraw: number;
  dailyIncome: number;
  investmentQuantity: number;
  ownedProducts: number[];
  transactions?: TransactionRecord[];
}

export interface TransactionRecord {
  id: string;
  type: "deposit" | "withdraw" | "purchase" | "sale" | "dailyIncome";
  amount: number;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  details?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserBalance: (amount: number) => void;
  updateUserDeposit: (amount: number) => void;
  updateUserWithdraw: (amount: number) => void;
  addOwnedProduct: (productId: number) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  resetPassword: (email: string) => Promise<boolean>;
  addTransaction: (transaction: Omit<TransactionRecord, "id" | "timestamp">) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('investmentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('investmentUser', JSON.stringify(user));
    }
  }, [user]);

  
  const login = async (email: string, password: string) => {
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo purposes, create a mock user
      if (email && password) {
        const mockUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          username: email.split('@')[0],
          email,
          phone: "9182475" + Math.floor(1000 + Math.random() * 9000).toString(),
          balance: 0,
          totalDeposit: 0,
          totalWithdraw: 0,
          dailyIncome: 0,
          investmentQuantity: 0,
          ownedProducts: [],
          transactions: []
        };
        
        setUser(mockUser);
        setIsAuthenticated(true);
        toast({
          title: "Login Successful",
          description: "Welcome back to your investment dashboard",
        });
        return true;
      }
      return false;
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
      return false;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        email,
        phone: "9182475" + Math.floor(1000 + Math.random() * 9000).toString(),
        balance: 0,
        totalDeposit: 0,
        totalWithdraw: 0,
        dailyIncome: 0,
        investmentQuantity: 0,
        ownedProducts: [],
        transactions: []
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      toast({
        title: "Registration Successful",
        description: "Your account has been created",
      });
      return true;
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Could not create your account",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('investmentUser');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully"
    });
  };

  const updateUserBalance = (amount: number) => {
    if (user) {
      setUser({
        ...user,
        balance: user.balance + amount
      });
    }
  };

  const updateUserDeposit = (amount: number) => {
    if (user) {
      setUser({
        ...user,
        totalDeposit: user.totalDeposit + amount,
        balance: user.balance + amount
      });
      
      // Add transaction record
      addTransaction({
        type: "deposit",
        amount,
        status: "completed",
        details: "Funds added to account"
      });
    }
  };

  const updateUserWithdraw = (amount: number) => {
    if (user && user.balance >= amount) {
      setUser({
        ...user,
        totalWithdraw: user.totalWithdraw + amount,
        balance: user.balance - amount
      });
      
      // Add transaction record
      addTransaction({
        type: "withdraw",
        amount,
        status: "completed",
        details: "Funds withdrawn from account"
      });
      
      return true;
    } else {
      // Failed withdrawal due to insufficient balance
      if (user) {
        addTransaction({
          type: "withdraw",
          amount,
          status: "failed",
          details: "Insufficient balance"
        });
      }
      return false;
    }
  };

  const addOwnedProduct = (productId: number) => {
    if (user) {
      setUser({
        ...user,
        ownedProducts: [...user.ownedProducts, productId],
        investmentQuantity: user.investmentQuantity + 1
      });
      
      // Assuming a fixed price for products (in a real app, this would be determined elsewhere)
      const productPrice = 100; // Example price
      
      // Add transaction record
      addTransaction({
        type: "purchase",
        amount: productPrice,
        status: "completed",
        details: `Purchased product ID: ${productId}`
      });
    }
  };
  
  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({
        ...user,
        ...updates
      });
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const addTransaction = (transactionData: Omit<TransactionRecord, "id" | "timestamp">) => {
    if (user) {
      const newTransaction: TransactionRecord = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        ...transactionData
      };
      
      setUser({
        ...user,
        transactions: [newTransaction, ...(user.transactions || [])]
      });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        login, 
        register, 
        logout, 
        updateUserBalance,
        updateUserDeposit,
        updateUserWithdraw,
        addOwnedProduct,
        updateUserProfile,
        resetPassword,
        addTransaction
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
