
import { User, TransactionRecord } from "@/types/auth";
import { createTransactionRecord } from "@/utils/authUtils";
import { showToast } from "@/utils/toastUtils";

// Update user balance (general)
export const updateBalance = (user: User, amount: number): User => {
  return {
    ...user,
    balance: user.balance + amount
  };
};

// Update user deposit amount
export const updateDeposit = (user: User, amount: number): User => {
  const updatedUser = {
    ...user,
    totalDeposit: user.totalDeposit + amount,
    balance: user.balance + amount
  };
  
  return updatedUser;
};

// Update user withdraw amount
export const updateWithdraw = (user: User, amount: number): User | null => {
  if (user.balance < amount) {
    return null;
  }
  
  return {
    ...user,
    totalWithdraw: user.totalWithdraw + amount,
    balance: user.balance - amount
  };
};

// Add owned product to user
export const addProductToUser = (user: User, productId: number, price: number): User => {
  return {
    ...user,
    ownedProducts: [...user.ownedProducts, productId],
    investmentQuantity: user.investmentQuantity + 1,
    balance: user.balance - price
  };
};

// Remove owned product from user
export const removeProductFromUser = (user: User, productId: number, sellPrice: number): User => {
  return {
    ...user,
    ownedProducts: user.ownedProducts.filter(id => id !== productId),
    investmentQuantity: user.investmentQuantity - 1,
    balance: user.balance + sellPrice
  };
};

// Add transaction to user history
export const addTransactionToUser = (
  user: User,
  transactionData: Omit<TransactionRecord, "id" | "timestamp">
): User => {
  const newTransaction = createTransactionRecord(transactionData);
  
  return {
    ...user,
    transactions: [newTransaction, ...(user.transactions || [])]
  };
};
