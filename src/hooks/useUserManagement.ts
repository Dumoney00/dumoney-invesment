
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
      saveUser(updateBalance(user, amount));
    }
  };

  const updateUserDeposit = (amount: number) => {
    if (user) {
      const updatedUser = updateDeposit(user, amount);
      saveUser(updatedUser);
      
      addTransaction({
        type: "deposit",
        amount,
        status: "completed",
        details: "Funds added to account"
      });
    }
  };

  const updateUserWithdraw = (amount: number) => {
    if (!user) return false;
    
    const updatedUser = updateWithdraw(user, amount);
    
    if (updatedUser) {
      saveUser(updatedUser);
      
      addTransaction({
        type: "withdraw",
        amount,
        status: "completed",
        details: "Funds withdrawn from account"
      });
      
      return true;
    } else {
      addTransaction({
        type: "withdraw",
        amount,
        status: "failed",
        details: "Insufficient balance"
      });
      return false;
    }
  };

  const addOwnedProduct = (productId: number, price: number) => {
    if (user) {
      const updatedUser = addProductToUser(user, productId, price);
      saveUser(updatedUser);
      
      addTransaction({
        type: "purchase",
        amount: price,
        status: "completed",
        details: `Purchased product ID: ${productId}`
      });
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
    saveUser(updatedUser);
    
    addTransaction({
      type: "sale",
      amount: sellPrice,
      status: "completed",
      details: `Sold product ID: ${productId}`
    });
    
    return true;
  };
  
  const addTransaction = (transactionData: Omit<TransactionRecord, "id" | "timestamp">) => {
    if (user) {
      const updatedUser = addTransactionToUser(user, transactionData);
      saveUser(updatedUser);
    }
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
