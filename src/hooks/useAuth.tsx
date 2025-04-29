
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { AuthService } from "@/types/auth-service";
import { showToast } from '@/utils/toastUtils';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = (): AuthService => {
  const {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateUserProfile: saveUser
  } = useSupabaseAuth();

  // Create a function that matches the resetPassword signature in AuthService
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      // Track password reset attempt in transactions for admin dashboard
      if (user) {
        await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            type: 'account_security',
            amount: 0,
            status: 'pending',
            details: `Password reset requested for email: ${email}`
          });
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/change-password`,
      });
      
      if (error) {
        showToast("Error", error.message, "destructive");
        return false;
      }
      
      showToast("Success", "Password reset email sent", "default");
      return true;
    } catch (error) {
      console.error("Reset password error:", error);
      showToast("Error", "Failed to send reset email", "destructive");
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    saveUser,
    login,
    register,
    logout,
    resetPassword
  };
};
