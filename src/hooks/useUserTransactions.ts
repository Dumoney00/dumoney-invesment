
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
import { supabase } from "@/integrations/supabase/client";

export const useUserTransactions = (
  user: User | null,
  saveUser: (user: User | null) => void
) => {
  // Log activity to the database
  const logActivity = async (
    activityType: string,
    details: string,
    amount: number | null = null
  ) => {
    if (!user) return;
    
    try {
      // Get IP address for location tracking
      let ipAddress = null;
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress = data.ip;
      } catch (ipError) {
        console.error('Failed to fetch IP address:', ipError);
      }
      
      await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          username: user.username,
          activity_type: activityType,
          amount: amount,
          details: details,
          ip_address: ipAddress
        });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  const updateUserBalance = (amount: number) => {
    if (user) {
      saveUser(updateBalance(user, amount));
    }
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
      
      // Log activity
      logActivity('deposit', 'Funds deposited to account', amount);
      
      saveUser(userWithTransaction);
    }
  };

  const updateUserWithdraw = (amount: number) => {
    if (!user) return false;
    
    const updatedUser = updateWithdraw(user, amount);
    
    if (updatedUser) {
      const userWithTransaction = addTransactionToUser(updatedUser, {
        type: "withdraw",
        amount,
        status: "completed",
        details: "Funds withdrawn from account"
      });
      
      // Log activity
      logActivity('withdraw', 'Funds withdrawn from account', amount);
      
      saveUser(userWithTransaction);
      return true;
    } else {
      const userWithFailedTransaction = addTransactionToUser(user, {
        type: "withdraw",
        amount,
        status: "failed",
        details: "Insufficient balance"
      });
      
      // Log failed activity
      logActivity('withdraw', 'Withdrawal failed: Insufficient balance', amount);
      
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
        details: `Purchased product ID: ${productId}`
      });
      
      // Log activity
      logActivity('purchase', `Purchased product ID: ${productId}`, price);
      
      saveUser(userWithTransaction);
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
    
    // Log activity
    logActivity('sale', `Sold product ID: ${productId}`, sellPrice);
    
    saveUser(userWithTransaction);
    return true;
  };
  
  const addTransaction = (transactionData: Omit<TransactionRecord, "id" | "timestamp">) => {
    if (user) {
      const updatedUser = addTransactionToUser(user, transactionData);
      
      // Log activity based on transaction type
      if (transactionData.status === 'completed') {
        logActivity(
          transactionData.type,
          transactionData.details || `${transactionData.type} transaction`,
          transactionData.amount
        );
      }
      
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

  // Manually trigger daily income addition
  const processDailyIncome = () => {
    if (user) {
      const updatedUser = addDailyIncome(user);
      if (updatedUser !== user) {
        // Log daily income activity
        logActivity(
          'daily_income', 
          'Daily income added to withdrawal wallet', 
          updatedUser.dailyIncome
        );
        
        saveUser(updatedUser);
        return true;
      }
    }
    return false;
  };

  return {
    updateUserBalance,
    updateUserDeposit,
    updateUserWithdraw,
    addOwnedProduct,
    sellOwnedProduct,
    updateUserProfile,
    addTransaction,
    processDailyIncome
  };
};
