
import React from 'react';
import { TransactionRecord } from '@/types/auth';
import { Filter, Check, Download } from 'lucide-react';
import TransactionStatsCard from '../stats/TransactionStatsCard';

interface TransactionStatsProps {
  transactions: TransactionRecord[];
}

const TransactionStats: React.FC<TransactionStatsProps> = ({ transactions }) => {
  const totalTransactions = transactions.length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  const totalDeposits = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
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
  );
};

export default TransactionStats;
