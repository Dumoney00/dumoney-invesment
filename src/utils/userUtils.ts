
import { User, TransactionRecord } from "@/types/auth";
import { createTransactionRecord } from "@/utils/authUtils";

// Update user balance directly (without creating a transaction)
export const updateBalance = (user: User, amount: number): User => {
  return {
    ...user,
    balance: user.balance + amount
  };
};

// Update user deposit balance
export const updateDeposit = (user: User, amount: number): User => {
  return {
    ...user,
    totalDeposit: user.totalDeposit + amount,
    balance: user.balance + amount
  };
};

// Update user withdraw amount (only from withdrawal wallet)
export const updateWithdraw = (user: User, amount: number): User | null => {
  if (user.withdrawalBalance < amount) {
    return null;
  }
  
  return {
    ...user,
    totalWithdraw: user.totalWithdraw + amount,
    withdrawalBalance: user.withdrawalBalance - amount
  };
};

// Add income to withdrawal wallet
export const addIncomeToWithdrawalWallet = (user: User, amount: number): User => {
  return {
    ...user,
    withdrawalBalance: user.withdrawalBalance + amount
  };
};

// Add owned product to user
export const addProductToUser = (user: User, productId: number, price: number): User => {
  const updatedDailyIncome = user.dailyIncome + (price * 0.033); // 3.3% daily income rate

  return {
    ...user,
    ownedProducts: [...user.ownedProducts, productId],
    investmentQuantity: user.investmentQuantity + 1,
    balance: user.balance - price,
    dailyIncome: updatedDailyIncome,
  };
};

// Remove product from user and add sell price to balance
export const removeProductFromUser = (user: User, productId: number, sellPrice: number): User => {
  // Find the product to remove
  const productIndex = user.ownedProducts.indexOf(productId);
  if (productIndex === -1) {
    return user; // Product not found, return unchanged user
  }
  
  // Calculate income reduction based on the product's daily income contribution
  // Using the same 3.3% rate as in addProductToUser
  const incomeReduction = sellPrice * 0.033;
  
  // Create new owned products array without the sold product
  const updatedOwnedProducts = user.ownedProducts.filter(id => id !== productId);
  
  return {
    ...user,
    ownedProducts: updatedOwnedProducts,
    investmentQuantity: user.investmentQuantity - 1,
    // Add sell price to withdrawal balance since it's a profit
    withdrawalBalance: user.withdrawalBalance + sellPrice,
    // Reduce daily income
    dailyIncome: Math.max(0, user.dailyIncome - incomeReduction)
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
