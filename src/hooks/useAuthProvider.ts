
import { useState, useEffect } from 'react';
import { User, TransactionRecord } from "@/types/auth";
import { 
  createMockUser,
  createTransactionRecord,
  loadUserFromStorage,
  saveUserToStorage,
  showToast
} from "@/utils/authUtils";

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = loadUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    saveUserToStorage(user);
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo purposes, create a mock user
      if (email && password) {
        const mockUser = createMockUser(email.split('@')[0], email);
        
        setUser(mockUser);
        setIsAuthenticated(true);
        showToast(
          "Login Successful",
          "Welcome back to your investment dashboard"
        );
        return true;
      }
      return false;
    } catch (error) {
      showToast(
        "Login Failed",
        "Invalid email or password",
        "destructive"
      );
      return false;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockUser = createMockUser(username, email);
      
      setUser(mockUser);
      setIsAuthenticated(true);
      showToast(
        "Registration Successful",
        "Your account has been created"
      );
      return true;
    } catch (error) {
      showToast(
        "Registration Failed",
        "Could not create your account",
        "destructive"
      );
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('investmentUser');
    showToast(
      "Logged Out",
      "You have been logged out successfully"
    );
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
      const newTransaction = createTransactionRecord(transactionData);
      
      setUser({
        ...user,
        transactions: [newTransaction, ...(user.transactions || [])]
      });
    }
  };

  return {
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
  };
};
