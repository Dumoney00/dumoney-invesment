
import { User, TransactionRecord } from "@/types/auth";
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
import { v4 as uuidv4 } from 'uuid';

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

  const updateUserDeposit = async (amount: number) => {
    if (user) {
      const updatedUser = updateDeposit(user, amount);
      
      // Create a transaction record in Supabase
      try {
        await supabase
          .from('transactions')
          .insert({
            id: uuidv4(),
            user_id: user.id,
            type: 'deposit',
            amount: amount,
            status: 'completed',
            details: 'Funds added to account'
          });
      } catch (error) {
        console.error('Failed to record deposit transaction:', error);
      }
      
      const userWithTransaction = addTransactionToUser(updatedUser, {
        type: "deposit",
        amount,
        status: "completed",
        details: "Funds added to account"
      });
      
      // Log activity
      await logActivity('deposit', 'Funds deposited to account', amount);
      
      saveUser(userWithTransaction);
    }
  };

  const updateUserWithdraw = async (amount: number) => {
    if (!user) return false;
    
    const updatedUser = updateWithdraw(user, amount);
    
    if (updatedUser) {
      try {
        await supabase
          .from('transactions')
          .insert({
            id: uuidv4(),
            user_id: user.id,
            type: 'withdraw',
            amount: amount,
            status: 'completed',
            details: 'Funds withdrawn from account'
          });
      } catch (error) {
        console.error('Failed to record withdrawal transaction:', error);
      }
      
      const userWithTransaction = addTransactionToUser(updatedUser, {
        type: "withdraw",
        amount,
        status: "completed",
        details: "Funds withdrawn from account"
      });
      
      // Log activity
      await logActivity('withdraw', 'Funds withdrawn from account', amount);
      
      saveUser(userWithTransaction);
      return true;
    } else {
      try {
        await supabase
          .from('transactions')
          .insert({
            id: uuidv4(),
            user_id: user.id,
            type: 'withdraw',
            amount: amount,
            status: 'failed',
            details: 'Insufficient balance'
          });
      } catch (error) {
        console.error('Failed to record failed withdrawal transaction:', error);
      }
      
      const userWithFailedTransaction = addTransactionToUser(user, {
        type: "withdraw",
        amount,
        status: "failed",
        details: "Insufficient balance"
      });
      
      // Log failed activity
      await logActivity('withdraw', 'Withdrawal failed: Insufficient balance', amount);
      
      saveUser(userWithFailedTransaction);
      return false;
    }
  };

  const addOwnedProduct = async (productId: number, price: number) => {
    if (user) {
      const updatedUser = addProductToUser(user, productId, price);
      
      try {
        await supabase
          .from('transactions')
          .insert({
            id: uuidv4(),
            user_id: user.id,
            type: 'purchase',
            amount: price,
            status: 'completed',
            details: `Purchased product ID: ${productId}`,
            product_id: productId
          });
          
        // Also add to owned_products table
        const product = updatedUser.ownedProducts.find(p => p.productId === productId);
        if (product) {
          await supabase
            .from('owned_products')
            .insert({
              user_id: user.id,
              product_id: productId,
              purchase_date: product.purchaseDate,
              cycle_days: product.cycleDays
            });
        }
      } catch (error) {
        console.error('Failed to record purchase transaction:', error);
      }
      
      const userWithTransaction = addTransactionToUser(updatedUser, {
        type: "purchase",
        amount: price,
        status: "completed",
        details: `Purchased product ID: ${productId}`
      });
      
      // Log activity
      await logActivity('purchase', `Purchased product ID: ${productId}`, price);
      
      saveUser(userWithTransaction);
    }
  };
  
  const sellOwnedProduct = async (productId: number, sellPrice: number) => {
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
    
    try {
      await supabase
        .from('transactions')
        .insert({
          id: uuidv4(),
          user_id: user.id,
          type: 'sale',
          amount: sellPrice,
          status: 'completed',
          details: `Sold product ID: ${productId}`,
          product_id: productId
        });
        
      // Also remove from owned_products
      await supabase
        .from('owned_products')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
    } catch (error) {
      console.error('Failed to record sale transaction:', error);
    }
    
    const userWithTransaction = addTransactionToUser(updatedUser, {
      type: "sale",
      amount: sellPrice,
      status: "completed",
      details: `Sold product ID: ${productId}`
    });
    
    // Log activity
    await logActivity('sale', `Sold product ID: ${productId}`, sellPrice);
    
    saveUser(userWithTransaction);
    return true;
  };
  
  const addTransaction = async (transactionData: Omit<TransactionRecord, "id" | "timestamp">) => {
    if (user) {
      // Add transaction to Supabase
      const transactionId = uuidv4();
      const timestamp = new Date().toISOString();
      
      try {
        await supabase
          .from('transactions')
          .insert({
            id: transactionId,
            user_id: user.id,
            type: transactionData.type,
            amount: transactionData.amount,
            timestamp: timestamp,
            status: transactionData.status,
            details: transactionData.details,
            product_id: transactionData.productId,
            product_name: transactionData.productName,
            withdrawal_time: transactionData.withdrawalTime,
            approved_by: transactionData.approvedBy,
            approval_timestamp: transactionData.approvalTimestamp
          });
      } catch (error) {
        console.error('Failed to add transaction:', error);
      }
      
      // Add to local user object
      const updatedUser = addTransactionToUser(user, transactionData);
      
      // Log activity based on transaction type
      if (transactionData.status === 'completed') {
        await logActivity(
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
  
  const updateUserProfile = async (updates: Partial<User>) => {
    if (user) {
      const updatedUser = {
        ...user,
        ...updates
      };
      
      // Update in Supabase
      try {
        await supabase
          .from('users')
          .update({
            username: updates.username !== undefined ? updates.username : user.username,
            email: updates.email !== undefined ? updates.email : user.email,
            phone: updates.phone !== undefined ? updates.phone : user.phone,
            balance: updates.balance !== undefined ? updates.balance : user.balance,
            withdrawal_balance: updates.withdrawalBalance !== undefined ? updates.withdrawalBalance : user.withdrawalBalance,
            bank_details: updates.bankDetails !== undefined ? updates.bankDetails : user.bankDetails,
            upi_id: updates.upiId !== undefined ? updates.upiId : user.upiId
          })
          .eq('id', user.id);
      } catch (error) {
        console.error('Failed to update user profile:', error);
      }
      
      saveUser(updatedUser);
    }
  };

  // Manually trigger daily income addition
  const processDailyIncome = async () => {
    if (user) {
      const updatedUser = addDailyIncome(user);
      if (updatedUser !== user) {
        // Log daily income activity
        await logActivity(
          'daily_income', 
          'Daily income added to withdrawal wallet', 
          updatedUser.dailyIncome
        );
        
        // Add transaction to Supabase
        try {
          await supabase
            .from('transactions')
            .insert({
              id: uuidv4(),
              user_id: user.id,
              type: 'dailyIncome',
              amount: updatedUser.dailyIncome,
              status: 'completed',
              details: 'Daily income added to withdrawal wallet'
            });
        } catch (error) {
          console.error('Failed to record daily income transaction:', error);
        }
        
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
