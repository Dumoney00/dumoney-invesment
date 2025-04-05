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

  useEffect(() => {
    const storedUser = loadUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    saveUserToStorage(user);
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
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
      
      addTransaction({
        type: "withdraw",
        amount,
        status: "completed",
        details: "Funds withdrawn from account"
      });
      
      return true;
    } else {
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

  const addOwnedProduct = (productId: number, price: number) => {
    if (user) {
      setUser({
        ...user,
        ownedProducts: [...user.ownedProducts, productId],
        investmentQuantity: user.investmentQuantity + 1,
        balance: user.balance - price
      });
      
      addTransaction({
        type: "purchase",
        amount: price,
        status: "completed",
        details: `Purchased product ID: ${productId}`
      });
    }
  };
  
  const sellOwnedProduct = (productId: number, sellPrice: number) => {
    if (user) {
      if (!user.ownedProducts.includes(productId)) {
        showToast(
          "Sale Failed",
          "You don't own this product",
          "destructive"
        );
        return false;
      }
      
      setUser({
        ...user,
        ownedProducts: user.ownedProducts.filter(id => id !== productId),
        investmentQuantity: user.investmentQuantity - 1,
        balance: user.balance + sellPrice
      });
      
      addTransaction({
        type: "sale",
        amount: sellPrice,
        status: "completed",
        details: `Sold product ID: ${productId}`
      });
      
      return true;
    }
    return false;
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
    sellOwnedProduct,
    updateUserProfile,
    resetPassword,
    addTransaction
  };
};
