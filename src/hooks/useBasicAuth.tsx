import { useState } from 'react';
import { User } from "@/types/auth";
import { createMockUser, loadUserFromStorage, saveUserToStorage } from "@/utils/authUtils";
import { showToast } from "@/utils/toastUtils";

export const useBasicAuth = () => {
  const [user, setUser] = useState<User | null>(loadUserFromStorage());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user);

  const saveUser = (updatedUser: User | null) => {
    setUser(updatedUser);
    saveUserToStorage(updatedUser);
    setIsAuthenticated(!!updatedUser);
  };

  const login = async (emailOrPhone: string, password: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Get all users from localStorage to check credentials
      const storedUsers = localStorage.getItem('investmentUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Check if user exists with provided email or phone
      const foundUser = users.find((u: User) => 
        u.email === emailOrPhone || u.phone === emailOrPhone
      );
      
      if (foundUser && password) {
        saveUser(foundUser);
        showToast("Login Successful", "Welcome back to your investment dashboard");
        return true;
      }
      
      showToast("Login Failed", "Invalid credentials", "destructive");
      return false;
    } catch (error) {
      showToast("Login Failed", "Invalid credentials", "destructive");
      return false;
    }
  };

  const register = async (
    username: string, 
    email: string, 
    phone: string, 
    password: string,
    referralCode?: string
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if phone or email already exists
      const storedUsers = localStorage.getItem('investmentUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const existingUser = users.find((u: User) => 
        u.email === email || u.phone === phone
      );
      
      if (existingUser) {
        showToast(
          "Registration Failed",
          "An account with this email or phone number already exists",
          "destructive"
        );
        return false;
      }
      
      const mockUser = createMockUser(username, email, phone);
      
      // If referral code is provided, validate and store it
      if (referralCode) {
        // Store the referral code with the user
        mockUser.referralCode = referralCode;
      }
      
      saveUser(mockUser);
      
      // Update users array in localStorage
      users.push(mockUser);
      localStorage.setItem('investmentUsers', JSON.stringify(users));
      
      showToast("Registration Successful", "Your account has been created");
      return true;
    } catch (error) {
      showToast("Registration Failed", "Could not create your account", "destructive");
      return false;
    }
  };

  const logout = () => {
    saveUser(null);
    localStorage.removeItem('investmentUser');
    showToast("Logged Out", "You have been logged out successfully");
  };

  const resetPassword = async (email: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    } catch (error) {
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
