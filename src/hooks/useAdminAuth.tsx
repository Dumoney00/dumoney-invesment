
import { useState } from 'react';
import { User } from "@/types/auth";
import { validateAdminCredentials, createAdminUser } from "@/services/adminService";
import { showToast } from "@/utils/toastUtils";

export const useAdminAuth = (saveUser: (user: User | null) => void) => {
  const [isLoading, setIsLoading] = useState(false);

  const adminLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (validateAdminCredentials(email, password)) {
        const adminUser = createAdminUser(email);
        saveUser(adminUser);
        showToast("Admin Login Successful", "Welcome to the admin dashboard");
        return true;
      }
      
      showToast("Admin Login Failed", "Invalid credentials", "destructive");
      return false;
    } catch (error) {
      showToast("Admin Login Failed", "Could not log in", "destructive");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    adminLogin,
    isLoading
  };
};
