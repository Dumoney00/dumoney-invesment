
import { useState } from 'react';
import { TransactionRecord } from '@/types/auth';
import { showToast } from '@/utils/toastUtils';

export const useTransactionManagement = () => {
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [isApproving, setIsApproving] = useState(false);

  const handleSelectTransaction = (transactionId: string) => {
    setSelectedTransactions(prev => {
      if (prev.includes(transactionId)) {
        return prev.filter(id => id !== transactionId);
      }
      return [...prev, transactionId];
    });
  };

  const handleSelectAll = (pendingWithdrawals: TransactionRecord[]) => {
    if (selectedTransactions.length === pendingWithdrawals.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(pendingWithdrawals.map(t => t.id));
    }
  };

  const handleApproveWithdrawals = async (selectedTransactions: string[], userId?: string) => {
    setIsApproving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get current users from storage
      const storedUsers = localStorage.getItem('investmentUsers');
      const currentUser = localStorage.getItem('investmentUser');
      
      let allUsers = storedUsers ? JSON.parse(storedUsers) : [];
      let updatedCurrentUser = null;
      
      // Update transactions in all users
      allUsers = allUsers.map(user => {
        if (user.transactions) {
          user.transactions = user.transactions.map(transaction => {
            if (selectedTransactions.includes(transaction.id)) {
              return {
                ...transaction,
                status: 'completed',
                approvedBy: userId,
                approvalTimestamp: new Date().toISOString()
              };
            }
            return transaction;
          });
        }
        return user;
      });
      
      // Update current user if needed
      if (currentUser) {
        updatedCurrentUser = JSON.parse(currentUser);
        if (updatedCurrentUser.transactions) {
          updatedCurrentUser.transactions = updatedCurrentUser.transactions.map(transaction => {
            if (selectedTransactions.includes(transaction.id)) {
              return {
                ...transaction,
                status: 'completed',
                approvedBy: userId,
                approvalTimestamp: new Date().toISOString()
              };
            }
            return transaction;
          });
        }
      }
      
      // Save updated users back to storage
      localStorage.setItem('investmentUsers', JSON.stringify(allUsers));
      if (updatedCurrentUser) {
        localStorage.setItem('investmentUser', JSON.stringify(updatedCurrentUser));
      }
      
      showToast(
        "Withdrawals Approved",
        `Successfully approved ${selectedTransactions.length} withdrawal requests`
      );
      setSelectedTransactions([]);
    } catch (error) {
      showToast(
        "Approval Failed",
        "Could not approve withdrawals",
        "destructive"
      );
    } finally {
      setIsApproving(false);
    }
  };

  return {
    selectedTransactions,
    isApproving,
    handleSelectTransaction,
    handleSelectAll,
    handleApproveWithdrawals
  };
};
