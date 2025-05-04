
import { User, TransactionRecord } from "@/types/auth";
import { useBalanceOperations } from "./useBalanceOperations";
import { useProductTransactions } from "./useProductTransactions";
import { useProfileTransactions } from "./useProfileTransactions";
import { useGeneralTransactions } from "./useGeneralTransactions";
import { useIncomeTransactions } from "./useIncomeTransactions";
import { TransactionServiceResult } from "./types";

export const useUserTransactions = (
  user: User | null,
  saveUser: (user: User | null) => void
): TransactionServiceResult => {
  const { updateUserBalance, updateUserDeposit, updateUserWithdraw } = 
    useBalanceOperations(user, saveUser);
    
  const { addOwnedProduct, sellOwnedProduct } = 
    useProductTransactions(user, saveUser);
    
  const { updateUserProfile } = 
    useProfileTransactions(user, saveUser);
    
  const { addTransaction } = 
    useGeneralTransactions(user, saveUser);
    
  const { processDailyIncome } = 
    useIncomeTransactions(user, saveUser);

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
