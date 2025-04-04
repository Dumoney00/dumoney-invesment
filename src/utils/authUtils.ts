
import { User, TransactionRecord } from "@/types/auth";
import { toast } from "@/hooks/use-toast";

// Create mock user for testing/demo purposes
export const createMockUser = (
  username: string, 
  email: string
): User => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    username,
    email,
    phone: "9182475" + Math.floor(1000 + Math.random() * 9000).toString(),
    balance: 0,
    totalDeposit: 0,
    totalWithdraw: 0,
    dailyIncome: 0,
    investmentQuantity: 0,
    ownedProducts: [],
    transactions: []
  };
};

// Generate a transaction ID
export const generateTransactionId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Create a new transaction record
export const createTransactionRecord = (
  transactionData: Omit<TransactionRecord, "id" | "timestamp">
): TransactionRecord => {
  return {
    id: generateTransactionId(),
    timestamp: new Date().toISOString(),
    ...transactionData
  };
};

// Load user from localStorage
export const loadUserFromStorage = (): User | null => {
  const storedUser = localStorage.getItem('investmentUser');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
};

// Save user to localStorage
export const saveUserToStorage = (user: User | null): void => {
  if (user) {
    localStorage.setItem('investmentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('investmentUser');
  }
};

// Show toast notification
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
