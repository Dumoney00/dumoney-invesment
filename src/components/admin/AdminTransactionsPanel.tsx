
import React, { useState } from 'react';
import { TransactionRecord } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Check, Filter, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { showToast } from '@/utils/toastUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TransactionStatsCard from './stats/TransactionStatsCard';
import TransactionFilters from './transactions/TransactionFilters';
import TransactionTable from './transactions/TransactionTable';
import { useAllUserTransactions } from '@/hooks/useAllUserTransactions';

const AdminTransactionsPanel: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [isApproving, setIsApproving] = useState(false);
  
  // Use our hook to get all user transactions
  const { transactions, loading: loadingData, error } = useAllUserTransactions();

  const filteredTransactions = transactions.filter(transaction => {
    if (filter !== 'all' && transaction.type !== filter) {
      return false;
    }
    
    if (statusFilter !== 'all' && transaction.status !== statusFilter) {
      return false;
    }
    
    return (
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false
    );
  });

  const handleSelectTransaction = (transactionId: string) => {
    setSelectedTransactions(prev => {
      if (prev.includes(transactionId)) {
        return prev.filter(id => id !== transactionId);
      }
      return [...prev, transactionId];
    });
  };

  const handleSelectAll = () => {
    if (selectedTransactions.length === pendingWithdrawals.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(pendingWithdrawals.map(t => t.id));
    }
  };

  const handleApproveWithdrawals = async () => {
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
                approvedBy: user?.id,
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
                approvedBy: user?.id,
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

  const pendingWithdrawals = filteredTransactions.filter(
    t => t.type === 'withdraw' && t.status === 'pending'
  );

  const totalTransactions = transactions.length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  const totalDeposits = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading transactions: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Transaction Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <TransactionStatsCard
          title="Total Transactions"
          value={totalTransactions}
          icon={Filter}
          iconColorClass="bg-blue-500/20 text-blue-500"
        />
        <TransactionStatsCard
          title="Pending Approvals"
          value={pendingTransactions}
          icon={Check}
          iconColorClass="bg-amber-500/20 text-amber-500"
        />
        <TransactionStatsCard
          title="Total Deposits"
          value={`₹${totalDeposits.toLocaleString()}`}
          icon={Download}
          iconColorClass="bg-green-500/20 text-green-500"
        />
        <TransactionStatsCard
          title="Total Withdrawals"
          value={`₹${totalWithdrawals.toLocaleString()}`}
          icon={Download}
          iconColorClass="bg-purple-500/20 text-purple-500"
        />
      </div>

      {/* Transaction Management Card */}
      <Card className="bg-[#222B45]/80 border-[#33374D]">
        <CardHeader className="pb-3">
          <CardTitle className="text-white">Transaction Management</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionFilters
            searchTerm={searchTerm}
            filter={filter}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onFilterChange={setFilter}
            onStatusFilterChange={setStatusFilter}
          />
          
          {pendingWithdrawals.length > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <span className="text-gray-400 text-sm">
                {selectedTransactions.length} selected
              </span>
              <Button
                onClick={handleApproveWithdrawals}
                disabled={selectedTransactions.length === 0 || isApproving}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check size={16} className="mr-2" />
                {isApproving ? "Processing..." : "Approve Selected"}
              </Button>
            </div>
          )}

          {loadingData ? (
            <div className="text-center py-8 text-gray-400">
              Loading transactions...
            </div>
          ) : (
            <TransactionTable
              transactions={filteredTransactions}
              selectedTransactions={selectedTransactions}
              pendingWithdrawals={pendingWithdrawals}
              onSelectTransaction={handleSelectTransaction}
              onSelectAll={handleSelectAll}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransactionsPanel;
