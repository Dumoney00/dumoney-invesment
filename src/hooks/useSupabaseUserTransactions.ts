
import { TransactionRecord, User, UserOwnedProduct } from "@/types/auth";
import { showToast } from "@/utils/toastUtils";
import { supabase } from "@/integrations/supabase/client";

export const useSupabaseUserTransactions = (user: User | null) => {
  // Update user's balance
  const updateUserBalance = async (amount: number) => {
    if (!user) return false;
    
    try {
      // Calculate new balance
      const newBalance = user.balance + amount;
      
      // Update user in Supabase
      const { error } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', user.id);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error("Error updating user balance:", err);
      return false;
    }
  };

  // Update user's deposit amount
  const updateUserDeposit = async (amount: number) => {
    if (!user) return false;
    
    try {
      // Calculate new values
      const newBalance = user.balance + amount;
      const newTotalDeposit = user.totalDeposit + amount;
      
      // Update user in Supabase
      const { error: userError } = await supabase
        .from('users')
        .update({ 
          balance: newBalance,
          total_deposit: newTotalDeposit
        })
        .eq('id', user.id);
      
      if (userError) throw userError;
      
      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'deposit',
          amount: amount,
          status: 'completed',
          details: 'Funds added to account'
        });
      
      if (transactionError) throw transactionError;
      
      return true;
    } catch (err) {
      console.error("Error processing deposit:", err);
      return false;
    }
  };

  // Update user's withdrawal amount
  const updateUserWithdraw = async (amount: number) => {
    if (!user) return false;
    
    // Check if user has sufficient balance
    if (user.balance < amount) {
      // Create failed transaction record
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'withdraw',
          amount: amount,
          status: 'failed',
          details: 'Insufficient balance'
        });
      
      return false;
    }
    
    try {
      // Calculate new values
      const newBalance = user.balance - amount;
      const newTotalWithdraw = user.totalWithdraw + amount;
      
      // Update user in Supabase
      const { error: userError } = await supabase
        .from('users')
        .update({ 
          balance: newBalance,
          total_withdraw: newTotalWithdraw
        })
        .eq('id', user.id);
      
      if (userError) throw userError;
      
      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'withdraw',
          amount: amount,
          status: 'completed',
          details: 'Funds withdrawn from account'
        });
      
      if (transactionError) throw transactionError;
      
      return true;
    } catch (err) {
      console.error("Error processing withdrawal:", err);
      return false;
    }
  };

  // Add a product to user's owned products
  const addOwnedProduct = async (productId: number, price: number) => {
    if (!user) return false;
    
    try {
      // Deduct price from user's balance
      const newBalance = user.balance - price;
      const newInvestmentQuantity = user.investmentQuantity + 1;
      
      // Update user in Supabase
      const { error: userError } = await supabase
        .from('users')
        .update({ 
          balance: newBalance,
          investment_quantity: newInvestmentQuantity
        })
        .eq('id', user.id);
      
      if (userError) throw userError;
      
      // Add product to owned_products
      const { error: productError } = await supabase
        .from('owned_products')
        .insert({
          user_id: user.id,
          product_id: productId,
          cycle_days: 30 // Default value, adjust as needed
        });
      
      if (productError) throw productError;
      
      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'purchase',
          amount: price,
          status: 'completed',
          details: `Purchased product ID: ${productId}`,
          product_id: productId
        });
      
      if (transactionError) throw transactionError;
      
      return true;
    } catch (err) {
      console.error("Error adding owned product:", err);
      return false;
    }
  };
  
  // Sell a product from user's owned products
  const sellOwnedProduct = async (productId: number, sellPrice: number) => {
    if (!user) return false;
    
    try {
      // Check if user owns this product
      const { data: ownedProduct, error: checkError } = await supabase
        .from('owned_products')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();
      
      if (checkError || !ownedProduct) {
        showToast(
          "Sale Failed",
          "You don't own this product",
          "destructive"
        );
        return false;
      }
      
      // Add sell price to user's balance
      const newBalance = user.balance + sellPrice;
      const newInvestmentQuantity = Math.max(0, user.investmentQuantity - 1);
      
      // Update user in Supabase
      const { error: userError } = await supabase
        .from('users')
        .update({ 
          balance: newBalance,
          investment_quantity: newInvestmentQuantity
        })
        .eq('id', user.id);
      
      if (userError) throw userError;
      
      // Delete the product from owned_products
      const { error: deleteError } = await supabase
        .from('owned_products')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
      
      if (deleteError) throw deleteError;
      
      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'sale',
          amount: sellPrice,
          status: 'completed',
          details: `Sold product ID: ${productId}`,
          product_id: productId
        });
      
      if (transactionError) throw transactionError;
      
      return true;
    } catch (err) {
      console.error("Error selling product:", err);
      return false;
    }
  };
  
  // Add a transaction record
  const addTransaction = async (transactionData: Omit<TransactionRecord, "id" | "timestamp">) => {
    if (!user) return false;
    
    try {
      // Prepare transaction data for Supabase
      const transactionRecord = {
        user_id: user.id,
        type: transactionData.type,
        amount: transactionData.amount,
        status: transactionData.status,
        details: transactionData.details,
        product_id: transactionData.productId,
        product_name: transactionData.productName,
        withdrawal_time: transactionData.withdrawalTime,
        approved_by: transactionData.approvedBy,
        approval_timestamp: transactionData.approvalTimestamp
      };
      
      // Insert transaction
      const { error } = await supabase
        .from('transactions')
        .insert(transactionRecord);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error("Error adding transaction:", err);
      return false;
    }
  };
  
  // Process daily income
  const processDailyIncome = async () => {
    if (!user) return false;
    
    try {
      // Get current date
      const now = new Date();
      const lastIncomeDate = user.lastIncomeCollection ? new Date(user.lastIncomeCollection) : null;
      
      // Check if income was already collected today
      if (lastIncomeDate && 
          lastIncomeDate.getDate() === now.getDate() &&
          lastIncomeDate.getMonth() === now.getMonth() &&
          lastIncomeDate.getFullYear() === now.getFullYear()) {
        return false; // Already collected today
      }
      
      // Update user's balance and last income collection date
      const newBalance = user.balance + user.dailyIncome;
      
      // Update user in Supabase
      const { error: userError } = await supabase
        .from('users')
        .update({ 
          balance: newBalance,
          last_income_collection: now.toISOString()
        })
        .eq('id', user.id);
      
      if (userError) throw userError;
      
      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'dailyIncome',
          amount: user.dailyIncome,
          status: 'completed',
          details: 'Daily income collected'
        });
      
      if (transactionError) throw transactionError;
      
      return true;
    } catch (err) {
      console.error("Error processing daily income:", err);
      return false;
    }
  };

  return {
    updateUserBalance,
    updateUserDeposit,
    updateUserWithdraw,
    addOwnedProduct,
    sellOwnedProduct,
    addTransaction,
    processDailyIncome
  };
};
