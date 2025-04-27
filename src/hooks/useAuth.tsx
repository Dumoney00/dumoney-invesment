
import { useBasicAuth } from './useBasicAuth';
import { useAdminAuth } from './useAdminAuth';
import { AuthService } from "@/types/auth-service";
import { User } from '@/types/auth';
import { 
  handleUserBlock, 
  handleUserUnblock, 
  handleReferralBonus 
} from "@/services/adminService";
import { showToast } from '@/utils/toastUtils';

export const useAuth = (): AuthService & {
  blockUser: (userId: string) => Promise<boolean>;
  unblockUser: (userId: string) => Promise<boolean>;
  approveReferralBonus: (userId: string, amount: number) => Promise<boolean>;
  loginAsUser: (user: User) => Promise<boolean>;
} => {
  const {
    user,
    isAuthenticated,
    saveUser,
    login,
    register,
    logout,
    resetPassword
  } = useBasicAuth();

  const { adminLogin } = useAdminAuth(saveUser);

  // Function to allow admin to login as a specific user
  const loginAsUser = async (targetUser: User): Promise<boolean> => {
    try {
      if (!user?.isAdmin) {
        showToast("Permission Denied", "Only admins can perform this action", "destructive");
        return false;
      }

      // Store the admin credentials to allow switching back
      const adminData = {
        id: user.id,
        email: user.email
      };

      // Create a copy of the user without overwriting the original
      const userCopy = { ...targetUser };

      // Add a flag to indicate this is an admin masquerading as a user
      userCopy.adminImpersonation = true;
      userCopy.originalAdminId = adminData.id;

      // Save the user to localStorage and update state
      saveUser(userCopy);

      showToast(
        "Success", 
        `Now browsing as ${userCopy.username}. You can return to admin panel anytime.`,
        "default"
      );

      return true;
    } catch (error) {
      console.error("Error login as user:", error);
      showToast("Error", "Could not login as user", "destructive");
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
    resetPassword,
    adminLogin,
    loginAsUser,
    blockUser: handleUserBlock,
    unblockUser: handleUserUnblock,
    approveReferralBonus: handleReferralBonus
  };
};
