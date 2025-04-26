
import { User, TransactionRecord } from "@/types/auth";
import { toast } from "@/hooks/use-toast";

export const createMockUser = (
  username: string, 
  email: string,
  phone: string
): User => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    username,
    email,
    phone,
    balance: 0,
    withdrawalBalance: 0,
    totalDeposit: 0,
    totalWithdraw: 0,
    dailyIncome: 0,
    investmentQuantity: 0,
    ownedProducts: [],
    transactions: []
  };
};

export const generateTransactionId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const createTransactionRecord = (
  transactionData: Omit<TransactionRecord, "id" | "timestamp">
): TransactionRecord => {
  return {
    id: generateTransactionId(),
    timestamp: new Date().toISOString(),
    ...transactionData
  };
};

export const loadUserFromStorage = (): User | null => {
  const storedUser = localStorage.getItem('investmentUser');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
};

export const saveUserToStorage = (user: User | null): void => {
  if (user) {
    localStorage.setItem('investmentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('investmentUser');
  }
};

export const checkExistingUser = (email: string, phone: string): boolean => {
  const storedUsers = localStorage.getItem('investmentUsers');
  if (!storedUsers) return false;
  
  const users: User[] = JSON.parse(storedUsers);
  return users.some(user => user.email === email || user.phone === phone);
};

export const findUserByEmailOrPhone = (emailOrPhone: string): User | null => {
  const storedUsers = localStorage.getItem('investmentUsers');
  if (!storedUsers) return null;
  
  const users: User[] = JSON.parse(storedUsers);
  return users.find(user => user.email === emailOrPhone || user.phone === emailOrPhone) || null;
};

export const showToast = (
  title: string,
  description: string,
  variant?: "default" | "destructive"
): void => {
  toast({
    title,
    description,
    variant
  });
};
