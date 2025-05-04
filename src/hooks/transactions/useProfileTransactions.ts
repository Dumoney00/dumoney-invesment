
import { User } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for managing user profile updates
 */
export const useProfileTransactions = (
  user: User | null,
  saveUser: (user: User | null) => void
) => {
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

  return {
    updateUserProfile
  };
};
