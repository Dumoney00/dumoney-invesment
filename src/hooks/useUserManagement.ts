
import { User, TransactionRecord } from "@/types/auth";
import { 
  updateBalance,
  updateDeposit,
  updateWithdraw,
  addProductToUser,
  removeProductFromUser,
  addTransactionToUser
} from "@/utils/userUtils";
import { showToast } from "@/utils/toastUtils";

export const useUserManagement = (
  user: User | null,
  saveUser: (user: User | null) => void
) => {
  const updateUserBalance = (amount: number) => {
    if (user) {
      const updatedUser = updateBalance(user, amount);
      saveUser(updatedUser);
      return updatedUser.balance;
    }
    return 0;
  };

  const updateUserDeposit = (amount: number) => {
    if (user) {
      // Update the user with the deposit amount
      const updatedUser = updateDeposit(user, amount);
      
      // Add the transaction record
      const userWithTransaction = addTransactionToUser(updatedUser, {
        type: "deposit",
        amount,
        status: "completed",
        details: "Funds added to account"
      });
      
      // Save the updated user with the transaction
      saveUser(userWithTransaction);
      
      console.log("Deposit completed. New balance:", userWithTransaction.balance);
      
      return userWithTransaction.balance;
    }
    return 0;
  };

  const updateUserWithdraw = (amount: number) => {
    if (!user) return false;
    
    const updatedUser = updateWithdraw(user, amount);
    
    if (updatedUser) {
      // Add the transaction record
      const userWithTransaction = addTransactionToUser(updatedUser, {
        type: "withdraw",
        amount,
        status: "completed",
        details: "Funds withdrawn from account"
      });
      
      // Save the updated user with the transaction
      saveUser(userWithTransaction);
      
      console.log("Withdrawal completed. New balance:", userWithTransaction.balance);
      
      return true;
    } else {
      // Still record the failed transaction attempt
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
      // Add product to owned products and update balance
      const updatedUser = addProductToUser(user, productId, price);
      
      // Add the transaction record for the investment
      const userWithTransaction = addTransactionToUser(updatedUser, {
        type: "purchase",
        amount: price,
        status: "completed",
        details: `Investment in product ID: ${productId}`
      });
      
      saveUser(userWithTransaction);
      console.log("Investment completed. New balance:", userWithTransaction.balance);
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
    
    // Add the transaction record
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

  return {
    updateUserBalance,
    updateUserDeposit,
    updateUserWithdraw,
    addOwnedProduct,
    sellOwnedProduct,
    updateUserProfile,
    addTransaction
  };
};
