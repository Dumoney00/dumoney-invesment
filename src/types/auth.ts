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
  bankDetails?: BankDetails; // Bank account details for withdrawals
  upiId?: string; // UPI ID for quick payments
}

export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
}

export type TransactionType = "deposit" | "withdraw" | "purchase" | "sale" | "dailyIncome" | "referralBonus";

export type TransactionStatus = "completed" | "pending" | "failed";

export interface TransactionRecord {
  id: string;
  type: TransactionType;
  amount: number;
  timestamp: string;
  status: TransactionStatus;
  details?: string;
  userId?: string; // User ID for admin view
  userName?: string; // User's name for admin view
  bankDetails?: BankDetails; // Bank details for withdrawals
  upiId?: string; // UPI ID for withdrawals
  withdrawalTime?: string; // Specific time for withdrawals
  approvedBy?: string; // Admin who approved the withdrawal
  approvalTimestamp?: string;
  productId?: number; // For purchase transactions
  productName?: string; // For purchase transactions
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, phone: string, password: string) => Promise<boolean>;
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
