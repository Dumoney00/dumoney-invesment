
import { useState, useEffect } from "react";
import { User } from "@/types/auth";

export const useBasicAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on initialization
  useEffect(() => {
    const storedUser = localStorage.getItem('investmentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('investmentUser');
      }
    }
  }, []);

  const saveUser = (userData: User | null) => {
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('investmentUser', JSON.stringify(userData));
    } else {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('investmentUser');
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const storedUsers = localStorage.getItem('investmentUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      const foundUser = users.find((u: any) => u.email === email && u.password === password);

      if (foundUser) {
        saveUser(foundUser);
        return { success: true };
      } else {
        console.log('Login failed: Invalid credentials');
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An unexpected error occurred' };
    }
  };

  const register = async (username: string, email: string, password: string, phone?: string, referralCode?: string): Promise<{
    success: boolean;
    message?: string;
  }> => {
    try {
      const storedUsers = localStorage.getItem('investmentUsers');
      let users = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if email already exists
      if (users.find((u: any) => u.email === email)) {
        console.log('Registration failed: Email already registered');
        return { success: false, message: 'Email already registered' };
      }

      const newUser: User = {
        id: Math.random().toString(36).substring(2, 15),
        username,
        email,
        password,
        phone: phone || '',
        balance: 0,
        withdrawalBalance: 0,
        totalDeposit: 0,
        totalWithdraw: 0,
        dailyIncome: 0,
        investmentQuantity: 0,
        transactions: [],
        ownedProducts: [],
        bankDetails: {
          accountNumber: '',
          ifscCode: '',
          accountHolderName: ''
        }
      };

      users.push(newUser);
      localStorage.setItem('investmentUsers', JSON.stringify(users));
      
      saveUser(newUser);
      console.log('Registration successful:', newUser);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'An unexpected error occurred' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('investmentUser');
    console.log('User logged out');
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const storedUsers = localStorage.getItem('investmentUsers');
      if (!storedUsers) return false;
      
      let users = JSON.parse(storedUsers);
      const userIndex = users.findIndex((u: any) => u.email === email);
      
      if (userIndex === -1) return false;
      
      // In a real app, we'd send an email. For now, just reset to a default password
      users[userIndex].password = 'resetpassword';
      localStorage.setItem('investmentUsers', JSON.stringify(users));
      
      console.log('Password reset successful for email:', email);
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    }
  };

  return { isAuthenticated, user, saveUser, login, register, logout, resetPassword };
};
