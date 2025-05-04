import { useState } from "react";
import { User } from "@/types/auth";

export const useBasicAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const saveUser = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const storedUsers = localStorage.getItem('investmentUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      saveUser(foundUser);
      localStorage.setItem('investmentUser', JSON.stringify(foundUser));
      return { success: true };
    } else {
      return { success: false, message: 'Invalid credentials' };
    }
  };

  const register = async (username: string, email: string, password: string, phone?: string): Promise<{
    success: boolean;
    message?: string;
  }> => {
    const storedUsers = localStorage.getItem('investmentUsers');
    let users = storedUsers ? JSON.parse(storedUsers) : [];

    if (users.find((u: any) => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }

    const newUser: User = {
      id: Math.random().toString(36).substring(2, 15),
      username,
      email,
      password,
      phone: phone || '',
      balance: 0,
      transactions: [],
      ownedProducts: [],
      bankDetails: {
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        upiId: ''
      }
    };

    users.push(newUser);
    localStorage.setItem('investmentUsers', JSON.stringify(users));
    saveUser(newUser);
    localStorage.setItem('investmentUser', JSON.stringify(newUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('investmentUser');
  };

  return { isAuthenticated, user, saveUser, login, register, logout };
};
