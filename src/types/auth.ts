export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  balance: number;
  totalDeposit: number;
  totalWithdraw: number;
  dailyIncome: number;
  investmentQuantity: number;
  ownedProducts: number[];
  transactions?: TransactionRecord[];
  lastIncomeCollection?: string; // Timestamp of last income collection
}

export type TransactionType = "deposit" | "withdraw" | "purchase" | "sale" | "dailyIncome";

export interface TransactionRecord {
  id: string;
  type: TransactionType;
  amount: number;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  details?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserBalance: (amount: number) => void;
  updateUserDeposit: (amount: number) => void;
  updateUserWithdraw: (amount: number) => void;
  addOwnedProduct: (productId: number, price: number) => void;
  sellOwnedProduct: (productId: number, sellPrice: number) => boolean;
  updateUserProfile: (updates: Partial<User>) => void;
  resetPassword: (email: string) => Promise<boolean>;
  addTransaction: (transaction: Omit<TransactionRecord, "id" | "timestamp">) => void;
}
