
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useAllUserTransactions } from '@/hooks/useAllUserTransactions';
import { useTransactionManagement } from '@/hooks/useTransactionManagement';
import TransactionStats from './transactions/TransactionStats';
import TransactionFilters from './transactions/TransactionFilters';
import TransactionTable from './transactions/TransactionTable';
import BulkActions from './transactions/BulkActions';

const AdminTransactionsPanel: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { transactions, loading: loadingData, error } = useAllUserTransactions();
  const {
    selectedTransactions,
    isApproving,
    handleSelectTransaction,
    handleSelectAll,
    handleApproveWithdrawals
  } = useTransactionManagement();

  const filteredTransactions = transactions.filter(transaction => {
    if (filter !== 'all' && transaction.type !== filter) return false;
    if (statusFilter !== 'all' && transaction.status !== statusFilter) return false;
    
    return (
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false
    );
  });

  const pendingWithdrawals = filteredTransactions.filter(
    t => t.type === 'withdraw' && t.status === 'pending'
  );

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading transactions: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TransactionStats transactions={transactions} />
      
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
          
          <BulkActions
            selectedTransactions={selectedTransactions}
            isApproving={isApproving}
            onApprove={() => handleApproveWithdrawals(selectedTransactions, user?.id)}
            pendingWithdrawals={pendingWithdrawals}
          />

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
              onSelectAll={() => handleSelectAll(pendingWithdrawals)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransactionsPanel;
