
import { useEffect } from 'react';
import { AuthContextType } from "@/types/auth";
import { useAuth } from './useAuth';
import { useUserManagement } from './useUserManagement';

export const useAuthProvider = (): AuthContextType => {
  const { 
    user, 
    isAuthenticated, 
    saveUser,
    login, 
    register, 
    logout,
    resetPassword,
    adminLogin,
    blockUser,
    unblockUser,
    approveReferralBonus
  } = useAuth();

  const {
    updateUserBalance,
    updateUserDeposit,
    updateUserWithdraw,
    addOwnedProduct,
    sellOwnedProduct,
    updateUserProfile,
    addTransaction
  } = useUserManagement(user, saveUser);

  // Add any effects or additional logic here
  useEffect(() => {
    // This effect can be used for additional setup if needed
  }, []);

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateUserBalance,
    updateUserDeposit,
    updateUserWithdraw,
    addOwnedProduct,
    sellOwnedProduct,
    updateUserProfile,
    resetPassword,
    addTransaction,
    adminLogin,
    blockUser,
    unblockUser,
    approveReferralBonus
  };
};
