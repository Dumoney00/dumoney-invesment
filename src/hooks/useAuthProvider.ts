
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
    loginAsUser,
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

  // Sync user data with localStorage whenever it changes
  useEffect(() => {
    if (user) {
      // Update user in the users array in localStorage
      const storedUsers = localStorage.getItem('investmentUsers');
      let users = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Find and update or add the current user
      const existingUserIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (existingUserIndex >= 0) {
        users[existingUserIndex] = user;
      } else {
        users.push(user);
      }
      
      // Save back to localStorage
      localStorage.setItem('investmentUsers', JSON.stringify(users));
    }
  }, [user]);

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
    loginAsUser,
    blockUser,
    unblockUser,
    approveReferralBonus
  };
};
