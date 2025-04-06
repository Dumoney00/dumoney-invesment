
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

  const login = async (email: string, password: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (email && password) {
        const mockUser = createMockUser(email.split('@')[0], email);
        
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

  const register = async (username: string, email: string, password: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockUser = createMockUser(username, email);
      
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
