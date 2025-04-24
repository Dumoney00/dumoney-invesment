
export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  balance: number; // Main deposit wallet
  withdrawalBalance: number; // Separate withdrawal wallet for earnings
  totalDeposit: number;
  totalWithdraw: number;
  dailyIncome: number;
  investmentQuantity: number;
  ownedProducts: number[];
  transactions?: TransactionRecord[];
  lastIncomeCollection?: string; // Timestamp of last income collection
  isAdmin?: boolean; // Flag to identify admin users
  isBlocked?: boolean; // Flag to identify blocked users
  referralCode?: string; // Referral code for the user
  referredBy?: string; // ID of the user who referred this user
  level?: number; // Level for referral program
}

export type TransactionType = "deposit" | "withdraw" | "purchase" | "sale" | "dailyIncome" | "referralBonus";

export interface TransactionRecord {
  id: string;
  type: TransactionType;
  amount: number;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  details?: string;
  userId?: string; // User ID for admin view
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
  adminLogin: (email: string, password: string) => Promise<boolean>;
  blockUser: (userId: string) => Promise<boolean>;
  unblockUser: (userId: string) => Promise<boolean>;
  approveReferralBonus: (userId: string, amount: number) => Promise<boolean>;
}
