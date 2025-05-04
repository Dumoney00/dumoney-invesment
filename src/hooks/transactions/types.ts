
import { User, TransactionRecord } from "@/types/auth";

export interface TransactionServiceResult {
  updateUserBalance: (amount: number) => void;
  updateUserDeposit: (amount: number) => Promise<void>;
  updateUserWithdraw: (amount: number) => Promise<boolean>;
  addOwnedProduct: (productId: number, price: number) => Promise<void>;
  sellOwnedProduct: (productId: number, sellPrice: number) => Promise<boolean>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  addTransaction: (transactionData: Omit<TransactionRecord, "id" | "timestamp">) => Promise<User | null>;
  processDailyIncome: () => Promise<boolean>;
}
