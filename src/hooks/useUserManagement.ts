
import { useEffect } from 'react';
import { User, TransactionRecord, UserOwnedProduct } from "@/types/auth";
import { 
  updateBalance,
  updateDeposit,
  updateWithdraw,
  addProductToUser,
  removeProductFromUser,
  addTransactionToUser,
  addDailyIncome
} from "@/utils/userUtils";
import { showToast } from "@/utils/toastUtils";

export const useUserManagement = (
  user: User | null,
  saveUser: (user: User | null) => void
) => {
  const updateUserBalance = (amount: number) => {
    if (user) {
      const updatedUser = updateBalance(user, amount);
      saveUser(updatedUser);
      return updatedUser.balance;
    }
    return 0;
  };

  const updateUserDeposit = (amount: number) => {
    if (user) {
      const updatedUser = updateDeposit(user, amount);
      
      const userWithTransaction = addTransactionToUser(updatedUser, {
        type: "deposit",
        amount,
        status: "completed",
        details: "Funds added to account"
      });
      
      saveUser(userWithTransaction);
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'investmentUser',
        newValue: JSON.stringify(userWithTransaction)
      }));
      
      console.log("Deposit completed. New balance:", userWithTransaction.balance);
      
      return userWithTransaction.balance;
    }
    return 0;
  };

  const updateUserWithdraw = (amount: number) => {
    if (!user) return false;
    
    const updatedUser = updateWithdraw(user, amount);
    
    if (updatedUser) {
      const userWithTransaction = addTransactionToUser(updatedUser, {
        type: "withdraw",
        amount,
        status: "pending",
        details: "Withdrawal request submitted"
      });
      
      saveUser(userWithTransaction);
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'investmentUser',
        newValue: JSON.stringify(userWithTransaction)
      }));
      
      console.log("Withdrawal request submitted. New balance:", userWithTransaction.balance);
      
      return true;
    } else {
      const userWithFailedTransaction = addTransactionToUser(user, {
        type: "withdraw",
        amount,
        status: "failed",
        details: "Insufficient balance"
      });
      
      saveUser(userWithFailedTransaction);
      return false;
    }
  };

  const addOwnedProduct = (productId: number, price: number) => {
    if (user) {
      const updatedUser = addProductToUser(user, productId, price);
      
      const userWithTransaction = addTransactionToUser(updatedUser, {
        type: "purchase",
        amount: price,
        status: "completed",
        details: `Investment in product ID: ${productId}`
      });
      
      saveUser(userWithTransaction);
      console.log("Investment completed. New balance:", userWithTransaction.balance);
    }
  };
  
  const sellOwnedProduct = (productId: number, sellPrice: number) => {
    if (!user) return false;
    
    const productExists = user.ownedProducts.some(product => product.productId === productId);
    
    if (!productExists) {
      showToast(
        "Sale Failed",
        "You don't own this product",
        "destructive"
      );
      return false;
    }
    
    const updatedUser = removeProductFromUser(user, productId, sellPrice);
    
    const userWithTransaction = addTransactionToUser(updatedUser, {
      type: "sale",
      amount: sellPrice,
      status: "completed",
      details: `Sold product ID: ${productId}`
    });
    
    saveUser(userWithTransaction);
    
    return true;
  };
  
  const addTransaction = (transactionData: Omit<TransactionRecord, "id" | "timestamp">) => {
    if (user) {
      const updatedUser = addTransactionToUser(user, transactionData);
      saveUser(updatedUser);
      return updatedUser;
    }
    return user;
  };
  
  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      saveUser({
        ...user,
        ...updates
      });
    }
  };

  // Check at component mount and every minute if daily income should be added
  useEffect(() => {
    if (!user) return;

    const checkDailyIncome = () => {
      const updatedUser = addDailyIncome(user);
      if (updatedUser !== user) {
        showToast(
          "Daily Income Added",
          `₹${user.dailyIncome.toFixed(2)} has been added to your withdrawal wallet`,
          "default"
        );
        saveUser(updatedUser);
      }
    };

    // Check immediately when component mounts
    checkDailyIncome();

    // Set interval to check every minute
    const interval = setInterval(checkDailyIncome, 60000);

    return () => clearInterval(interval);
  }, [user, saveUser]);

  return {
    updateUserBalance,
    updateUserDeposit,
    updateUserWithdraw,
    addOwnedProduct,
    sellOwnedProduct,
    updateUserProfile,
    addTransaction
  };
};

