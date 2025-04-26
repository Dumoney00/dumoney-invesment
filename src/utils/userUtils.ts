import { User, TransactionRecord, UserOwnedProduct } from "@/types/auth";
import { createTransactionRecord } from "@/utils/authUtils";
import { investmentData } from "@/data/investments";
import { showToast } from "@/utils/toastUtils";

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

// Add owned product to user with purchase date
export const addProductToUser = (user: User, productId: number, price: number): User => {
  const product = investmentData.find(p => p.id === productId);
  if (!product) return user;

  const newProduct: UserOwnedProduct = {
    productId,
    purchaseDate: new Date().toISOString(),
    cycleDays: product.cycleDays || 45 // Default to 45 if not specified
  };

  const updatedDailyIncome = user.dailyIncome + product.dailyIncome;

  return {
    ...user,
    ownedProducts: [...user.ownedProducts, newProduct],
    investmentQuantity: user.investmentQuantity + 1,
    balance: user.balance - price,
    dailyIncome: updatedDailyIncome,
  };
};

// Add daily income to withdrawal wallet with expiration check
export const addDailyIncome = (user: User): User => {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Only add income at 9 AM
  if (currentHour !== 9) {
    return user;
  }
  
  // Get last income date
  const lastIncome = user.lastIncomeCollection 
    ? new Date(user.lastIncomeCollection) 
    : null;
    
  // Check if income was already added today
  if (lastIncome) {
    const today = new Date();
    if (lastIncome.toDateString() === today.toDateString()) {
      return user;
    }
  }

  // Calculate valid income from active plans
  let totalDailyIncome = 0;
  const currentDate = new Date();
  const updatedOwnedProducts: UserOwnedProduct[] = [];

  for (const owned of user.ownedProducts) {
    const product = investmentData.find(p => p.id === owned.productId);
    if (!product) continue;

    const purchaseDate = new Date(owned.purchaseDate);
    const daysSincePurchase = Math.floor(
      (currentDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Check if plan is still active
    if (daysSincePurchase < owned.cycleDays) {
      totalDailyIncome += product.dailyIncome;
      updatedOwnedProducts.push(owned);
    } else {
      // Plan has expired, show notification
      showToast(
        "Plan Expired",
        `Your ${product.title} plan has completed its ${owned.cycleDays}-day cycle. Purchase a new plan to continue earning.`,
        "default"
      );
    }
  }

  // Skip if no active plans
  if (totalDailyIncome <= 0) {
    return {
      ...user,
      ownedProducts: updatedOwnedProducts,
      dailyIncome: 0
    };
  }

  // Add income to withdrawal wallet
  const updatedUser = {
    ...user,
    ownedProducts: updatedOwnedProducts,
    withdrawalBalance: user.withdrawalBalance + totalDailyIncome,
    dailyIncome: totalDailyIncome,
    lastIncomeCollection: new Date().toISOString()
  };

  // Add transaction record for daily income
  return addTransactionToUser(updatedUser, {
    type: "dailyIncome",
    amount: totalDailyIncome,
    status: "completed",
    details: "Daily income added to withdrawal wallet"
  });
};

// Update remove product function for expired plans
export const removeProductFromUser = (user: User, productId: number, sellPrice: number): User => {
  const product = investmentData.find(p => p.id === productId);
  if (!product) return user;
  
  const updatedOwnedProducts = user.ownedProducts.filter(p => p.productId !== productId);
  
  // Recalculate daily income based on remaining active plans
  const now = new Date();
  let newDailyIncome = 0;
  
  for (const owned of updatedOwnedProducts) {
    const prod = investmentData.find(p => p.id === owned.productId);
    if (!prod) continue;
    
    const purchaseDate = new Date(owned.purchaseDate);
    const daysSincePurchase = Math.floor(
      (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSincePurchase < owned.cycleDays) {
      newDailyIncome += prod.dailyIncome;
    }
  }
  
  return {
    ...user,
    ownedProducts: updatedOwnedProducts,
    investmentQuantity: user.investmentQuantity - 1,
    withdrawalBalance: user.withdrawalBalance + sellPrice,
    dailyIncome: newDailyIncome
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
