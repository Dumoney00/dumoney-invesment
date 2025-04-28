
import React from 'react';
import { TransactionRecord } from '@/types/auth';
import { formatDistanceToNow } from 'date-fns';
import { ArrowDownCircle, ArrowUpCircle, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentTransactionsProps {
  transactions: TransactionRecord[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const getTransactionIcon = (type: string, status: string) => {
    if (status !== 'completed') {
      return status === 'pending' ? 
        <Clock className="text-amber-400" size={20} /> : 
        <AlertCircle className="text-red-400" size={20} />;
    }
    
    switch (type) {
      case 'deposit':
        return <ArrowDownCircle className="text-green-400" size={20} />;
      case 'withdraw':
        return <ArrowUpCircle className="text-purple-400" size={20} />;
      default:
        return <CheckCircle className="text-blue-400" size={20} />;
    }
  };

  return (
    <div className="space-y-4">
      {transactions.length > 0 ? (
        transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center gap-3 pb-3 border-b border-[#33374D] last:border-0">
            <div className="w-10 h-10 rounded-full bg-[#2A3248] flex items-center justify-center">
              {getTransactionIcon(transaction.type, transaction.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-white">
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </p>
                <p className={cn(
                  "text-sm font-medium",
                  transaction.type === 'deposit' ? "text-green-400" : 
                  transaction.type === 'withdraw' ? "text-purple-400" : "text-blue-400"
                )}>
                  {transaction.type === 'withdraw' ? '-' : '+'} ₹{transaction.amount.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <span>{transaction.userName}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(transaction.timestamp), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-gray-500">No transactions found</div>
      )}
    </div>
  );
};

export default RecentTransactions;
