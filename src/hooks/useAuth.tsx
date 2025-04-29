
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { AuthService } from "@/types/auth-service";
import { showToast } from '@/utils/toastUtils';

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
      const { error } = await supabase.auth.resetPasswordForEmail(email);
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

// Import supabase at the top of the file
import { supabase } from '@/integrations/supabase/client';
