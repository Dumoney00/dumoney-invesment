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

const mockTransactions: TransactionRecord[] = [
  {
    id: 'trx_1',
    type: 'deposit',
    amount: 500,
    timestamp: new Date().toISOString(),
    status: 'completed',
    details: 'Deposit via bank transfer',
    userId: 'usr_123',
    userName: 'John Doe'
  },
  {
    id: 'trx_2',
    type: 'withdraw',
    amount: 200,
    timestamp: new Date().toISOString(),
    status: 'pending',
    details: 'Withdrawal to bank account',
    userId: 'usr_123',
    userName: 'John Doe',
    bankDetails: {
      accountNumber: 'XXXX1234',
      ifscCode: 'ABCD0001234',
      accountHolderName: 'John Doe'
    },
    withdrawalTime: new Date().toISOString()
  },
  {
    id: 'trx_3',
    type: 'purchase',
    amount: 1000,
    timestamp: new Date().toISOString(),
    status: 'completed',
    details: 'Investment in Gold Plan',
    userId: 'usr_456',
    userName: 'Jane Smith',
    productId: 1,
    productName: 'Gold Investment Plan'
  },
  {
    id: 'trx_4',
    type: 'referralBonus',
    amount: 50,
    timestamp: new Date().toISOString(),
    status: 'completed',
    details: 'Referral bonus for user usr_789',
    userId: 'usr_456',
    userName: 'Jane Smith'
  },
  {
    id: 'trx_5',
    type: 'withdraw',
    amount: 150,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    status: 'pending',
    details: 'Withdrawal to UPI',
    userId: 'usr_456',
    userName: 'Jane Smith',
    upiId: 'jane@upi',
    withdrawalTime: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'trx_6',
    type: 'withdraw',
    amount: 800,
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    status: 'pending',
    details: 'Withdrawal to bank account',
    userId: 'usr_789',
    userName: 'Robert Johnson',
    bankDetails: {
      accountNumber: 'XXXX5678',
      ifscCode: 'EFGH0005678',
      accountHolderName: 'Robert Johnson'
    },
    withdrawalTime: new Date(Date.now() - 172800000).toISOString()
  },
];

const AdminTransactionsPanel: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [transactions, setTransactions] = useState<TransactionRecord[]>(mockTransactions);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [isApproving, setIsApproving] = useState(false);

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
      
      setTransactions(prevTransactions => 
        prevTransactions.map(transaction => {
          if (selectedTransactions.includes(transaction.id)) {
            return {
              ...transaction,
              status: 'completed',
              approvedBy: user?.id,
              approvalTimestamp: new Date().toISOString()
            };
          }
          return transaction;
        })
      );
      
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

  return (
    <div className="space-y-6">
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

          <TransactionTable
            transactions={filteredTransactions}
            selectedTransactions={selectedTransactions}
            pendingWithdrawals={pendingWithdrawals}
            onSelectTransaction={handleSelectTransaction}
            onSelectAll={handleSelectAll}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransactionsPanel;
