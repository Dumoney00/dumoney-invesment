
import { useBasicAuth } from './useBasicAuth';
import { useAdminAuth } from './useAdminAuth';
import { AuthService } from "@/types/auth-service";
import { 
  handleUserBlock, 
  handleUserUnblock, 
  handleReferralBonus 
} from "@/services/adminService";

export const useAuth = (): AuthService & {
  blockUser: (userId: string) => Promise<boolean>;
  unblockUser: (userId: string) => Promise<boolean>;
  approveReferralBonus: (userId: string, amount: number) => Promise<boolean>;
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

  return {
    user,
    isAuthenticated,
    saveUser,
    login,
    register,
    logout,
    resetPassword,
    adminLogin,
    blockUser: handleUserBlock,
    unblockUser: handleUserUnblock,
    approveReferralBonus: handleReferralBonus
  };
};
