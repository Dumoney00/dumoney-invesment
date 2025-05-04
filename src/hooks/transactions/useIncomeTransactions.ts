
import { User } from "@/types/auth";
import { addDailyIncome, addTransactionToUser } from "@/utils/userUtils";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { useActivityLogger } from './useActivityLogger';

/**
 * Hook for managing income-related transactions
 */
export const useIncomeTransactions = (
  user: User | null,
  saveUser: (user: User | null) => void
) => {
  const { logActivity } = useActivityLogger(user);

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
    processDailyIncome
  };
};
