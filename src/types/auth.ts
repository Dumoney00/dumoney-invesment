
export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  balance: number;
  withdrawalBalance: number;
  totalDeposit: number;
  totalWithdraw: number;
  dailyIncome: number;
  investmentQuantity: number;
  ownedProducts: UserOwnedProduct[];
  transactions?: TransactionRecord[];
  lastIncomeCollection?: string;
  isAdmin?: boolean;
  isBlocked?: boolean;
  referralCode?: string;
  referralStatus?: 'pending' | 'approved';
  referredBy?: string;
  level?: number;
  bankDetails?: BankDetails;
  upiId?: string;
  adminImpersonation?: boolean;
  originalAdminId?: string;
}

export interface UserOwnedProduct {
  productId: number;
  purchaseDate: string;
  cycleDays: number;
}

export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
}

export type TransactionType = 
  | "deposit" 
  | "withdraw" 
  | "purchase" 
  | "sale" 
  | "dailyIncome" 
  | "referralBonus" 
  | "account_created" 
  | "account_activity" 
  | "account_update" 
  | "account_security"
  | string; // Adding string to accept any string value

export type TransactionStatus = "completed" | "pending" | "failed";

export interface TransactionRecord {
  id: string;
  type: TransactionType;
  amount: number;
  timestamp: string;
  status: TransactionStatus;
  details?: string;
  userId?: string;
  userName?: string;
  bankDetails?: BankDetails;
  upiId?: string;
  withdrawalTime?: string;
  approvedBy?: string;
  approvalTimestamp?: string;
  productId?: number;
  productName?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, phone: string, password: string, referralCode?: string) => Promise<boolean>;
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
