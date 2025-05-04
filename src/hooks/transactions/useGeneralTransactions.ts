
import { User, TransactionRecord } from "@/types/auth";
import { addTransactionToUser } from "@/utils/userUtils";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { useActivityLogger } from './useActivityLogger';

/**
 * Hook for managing general transaction operations
 */
export const useGeneralTransactions = (
  user: User | null,
  saveUser: (user: User | null) => void
) => {
  const { logActivity } = useActivityLogger(user);

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

  return {
    addTransaction
  };
};
