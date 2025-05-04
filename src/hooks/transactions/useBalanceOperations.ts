
import { User, TransactionRecord } from "@/types/auth";
import { updateBalance, updateDeposit, updateWithdraw } from "@/utils/userUtils";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { useActivityLogger } from './useActivityLogger';
import { addTransactionToUser } from "@/utils/userUtils";

/**
 * Hook for managing user balance operations
 */
export const useBalanceOperations = (
  user: User | null,
  saveUser: (user: User | null) => void
) => {
  const { logActivity } = useActivityLogger(user);

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

  return {
    updateUserBalance,
    updateUserDeposit,
    updateUserWithdraw
  };
};
