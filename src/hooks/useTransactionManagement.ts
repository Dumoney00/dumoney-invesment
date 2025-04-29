
import { useState } from 'react';
import { TransactionRecord } from '@/types/auth';
import { showToast } from '@/utils/toastUtils';
import { supabase } from '@/integrations/supabase/client';

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

  const handleApproveWithdrawals = async (selectedTransactions: string[], adminId?: string) => {
    setIsApproving(true);
    try {
      // Update all selected transactions to "completed" status
      const { error } = await supabase
        .from('transactions')
        .update({
          status: 'completed',
          approved_by: adminId,
          approval_timestamp: new Date().toISOString()
        })
        .in('id', selectedTransactions);

      if (error) throw error;
      
      showToast(
        "Withdrawals Approved",
        `Successfully approved ${selectedTransactions.length} withdrawal requests`
      );
      
      setSelectedTransactions([]);
    } catch (error) {
      console.error("Error approving withdrawals:", error);
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
