
import { useState } from 'react';
import { User } from "@/types/auth";
import { 
  createMockUser,
  loadUserFromStorage,
  saveUserToStorage 
} from "@/utils/authUtils";
import { showToast } from "@/utils/toastUtils";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(loadUserFromStorage());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user);

  // Save user to storage whenever it changes
  const saveUser = (updatedUser: User | null) => {
    setUser(updatedUser);
    saveUserToStorage(updatedUser);
    setIsAuthenticated(!!updatedUser);
  };

  const login = async (emailOrPhone: string, password: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (emailOrPhone && password) {
        // Changed to extract username from email if an email is used
        const username = emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : emailOrPhone;
        const mockUser = createMockUser(username, emailOrPhone, emailOrPhone);
        
        saveUser(mockUser);
        showToast(
          "Login Successful",
          "Welcome back to your investment dashboard"
        );
        return true;
      }
      return false;
    } catch (error) {
      showToast(
        "Login Failed",
        "Invalid email or password",
        "destructive"
      );
      return false;
    }
  };

  const register = async (username: string, email: string, phone: string, password: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockUser = createMockUser(username, email, phone);
      
      saveUser(mockUser);
      showToast(
        "Registration Successful",
        "Your account has been created"
      );
      return true;
    } catch (error) {
      showToast(
        "Registration Failed",
        "Could not create your account",
        "destructive"
      );
      return false;
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check for allowed admin credentials
      const allowedAdmins = [
        { email: 'admin@example.com', password: 'admin123' },
        { email: 'dvenkatkaka001@gmail.com', password: 'admin123' },
        { email: 'dvenkatkaka001@gmail.com', password: 'Nidasameer0@' }
      ];
      
      const isValidAdmin = allowedAdmins.some(
        admin => admin.email === email && admin.password === password
      );
      
      if (isValidAdmin) {
        const adminUser: User = {
          id: 'admin_' + Math.random().toString(36).substr(2, 9),
          username: 'Administrator',
          email,
          balance: 0,
          withdrawalBalance: 0,
          totalDeposit: 0,
          totalWithdraw: 0,
          dailyIncome: 0,
          investmentQuantity: 0,
          ownedProducts: [],
          isAdmin: true
        };
        
        saveUser(adminUser);
        showToast(
          "Admin Login Successful",
          "Welcome to the admin dashboard"
        );
        return true;
      }
      
      showToast(
        "Admin Login Failed",
        "Invalid credentials",
        "destructive"
      );
      return false;
    } catch (error) {
      showToast(
        "Admin Login Failed",
        "Could not log in",
        "destructive"
      );
      return false;
    }
  };

  const logout = () => {
    saveUser(null);
    localStorage.removeItem('investmentUser');
    showToast(
      "Logged Out",
      "You have been logged out successfully"
    );
  };
  
  const resetPassword = async (email: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    } catch (error) {
      return false;
    }
  };

  // Admin functions to block/unblock users
  const blockUser = async (userId: string) => {
    try {
      // In a real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      showToast(
        "User Blocked",
        `User ${userId} has been blocked successfully`
      );
      return true;
    } catch (error) {
      showToast(
        "Action Failed",
        "Could not block the user",
        "destructive"
      );
      return false;
    }
  };

  const unblockUser = async (userId: string) => {
    try {
      // In a real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      showToast(
        "User Unblocked",
        `User ${userId} has been unblocked successfully`
      );
      return true;
    } catch (error) {
      showToast(
        "Action Failed",
        "Could not unblock the user",
        "destructive"
      );
      return false;
    }
  };

  // Admin function to approve referral bonus
  const approveReferralBonus = async (userId: string, amount: number) => {
    try {
      // In a real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      showToast(
        "Bonus Approved",
        `Referral bonus of $${amount} approved for user ${userId}`
      );
      return true;
    } catch (error) {
      showToast(
        "Action Failed",
        "Could not approve the referral bonus",
        "destructive"
      );
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
    blockUser,
    unblockUser,
    approveReferralBonus
  };
};
