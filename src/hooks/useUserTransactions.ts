
import { User, TransactionRecord } from "@/types/auth";
import { 
  updateBalance,
  updateDeposit,
  updateWithdraw,
  addProductToUser,
  removeProductFromUser,
  addTransactionToUser,
  addDailyIncome
} from "@/utils/userUtils";
import { showToast } from "@/utils/toastUtils";

export const useUserTransactions = (
  user: User | null,
  saveUser: (user: User | null) => void
) => {
  const updateUserBalance = (amount: number) => {
    if (user) {
      saveUser(updateBalance(user, amount));
    }
  };

  const updateUserDeposit = (amount: number) => {
    if (user) {
      const updatedUser = updateDeposit(user, amount);
      
      const userWithTransaction = addTransactionToUser(updatedUser, {
        type: "deposit",
        amount,
        status: "completed",
        details: "Funds added to account"
      });
      
      saveUser(userWithTransaction);
    }
  };

  const updateUserWithdraw = (amount: number) => {
    if (!user) return false;
    
    const updatedUser = updateWithdraw(user, amount);
    
    if (updatedUser) {
      const userWithTransaction = addTransactionToUser(updatedUser, {
        type: "withdraw",
        amount,
        status: "completed",
        details: "Funds withdrawn from account"
      });
      
      saveUser(userWithTransaction);
      return true;
    } else {
      const userWithFailedTransaction = addTransactionToUser(user, {
        type: "withdraw",
        amount,
        status: "failed",
        details: "Insufficient balance"
      });
      
      saveUser(userWithFailedTransaction);
      return false;
    }
  };

  const addOwnedProduct = (productId: number, price: number) => {
    if (user) {
      const updatedUser = addProductToUser(user, productId, price);
      
      const userWithTransaction = addTransactionToUser(updatedUser, {
        type: "purchase",
        amount: price,
        status: "completed",
        details: `Purchased product ID: ${productId}`
      });
      
      saveUser(userWithTransaction);
    }
  };
  
  const sellOwnedProduct = (productId: number, sellPrice: number) => {
    if (!user) return false;
    
    if (!user.ownedProducts.includes(productId)) {
      showToast(
        "Sale Failed",
        "You don't own this product",
        "destructive"
      );
      return false;
    }
    
    const updatedUser = removeProductFromUser(user, productId, sellPrice);
    
    const userWithTransaction = addTransactionToUser(updatedUser, {
      type: "sale",
      amount: sellPrice,
      status: "completed",
      details: `Sold product ID: ${productId}`
    });
    
    saveUser(userWithTransaction);
    return true;
  };
  
  const addTransaction = (transactionData: Omit<TransactionRecord, "id" | "timestamp">) => {
    if (user) {
      const updatedUser = addTransactionToUser(user, transactionData);
      saveUser(updatedUser);
      return updatedUser;
    }
    return user;
  };
  
  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      saveUser({
        ...user,
        ...updates
      });
    }
  };

  // Manually trigger daily income addition
  const processDailyIncome = () => {
    if (user) {
      const updatedUser = addDailyIncome(user);
      if (updatedUser !== user) {
        saveUser(updatedUser);
        return true;
      }
    }
    return false;
  };

  return {
    updateUserBalance,
    updateUserDeposit,
    updateUserWithdraw,
    addOwnedProduct,
    sellOwnedProduct,
    updateUserProfile,
    addTransaction,
    processDailyIncome
  };
};
