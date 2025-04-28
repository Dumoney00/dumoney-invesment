
import { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { useAllUserTransactions } from "@/hooks/useAllUserTransactions";
import { useTransactionManagement } from "@/hooks/useTransactionManagement";
import { TransactionRecord } from "@/types/auth";
import { Check, MoreHorizontal, X } from "lucide-react";
import { getTransactionIcon, getTransactionIconClass } from "@/utils/transactionUtils";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatUtils";

export const TransactionsTable = () => {
  const { transactions, loading } = useAllUserTransactions();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const { selectedTransactions, isApproving, handleSelectTransaction, handleSelectAll, handleApproveWithdrawals } = useTransactionManagement();
  
  // Filter and sort transactions
  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });
  
  const pendingWithdrawals = transactions.filter(t => t.type === 'withdraw' && t.status === 'pending');
  
  const renderTransactionStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-medium">
            <Check className="h-3 w-3" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 text-red-500 text-xs font-medium">
            <X className="h-3 w-3" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-500/20 text-gray-500 text-xs font-medium">
            Unknown
          </span>
        );
    }
  };
  
  if (loading) {
    return <div className="text-center py-10">Loading transactions...</div>;
  }
  
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900/50 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4 bg-gray-800/50">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium text-gray-200">Transactions</h3>
          <div className="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-1 rounded-full">
            {filteredTransactions.length}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-800 rounded-lg p-0.5">
            <button 
              className={`px-3 py-1 text-sm rounded-md transition-colors ${filter === 'all' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-gray-200'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md transition-colors ${filter === 'pending' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-gray-200'}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md transition-colors ${filter === 'completed' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-gray-200'}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
          
          {pendingWithdrawals.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              className="bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500 hover:text-white"
              disabled={isApproving || selectedTransactions.length === 0}
              onClick={() => handleApproveWithdrawals(selectedTransactions, "admin-user")}
            >
              {isApproving ? 'Processing...' : `Approve (${selectedTransactions.length})`}
            </Button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-800/30">
            <TableRow className="hover:bg-transparent border-gray-700">
              {pendingWithdrawals.length > 0 && (
                <TableHead className="w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-600 text-amber-500 focus:ring-amber-500"
                    checked={selectedTransactions.length === pendingWithdrawals.length && pendingWithdrawals.length > 0}
                    onChange={() => handleSelectAll(pendingWithdrawals)}
                  />
                </TableHead>
              )}
              <TableHead className="text-gray-400">User</TableHead>
              <TableHead className="text-gray-400">Type</TableHead>
              <TableHead className="text-gray-400 text-right">Amount</TableHead>
              <TableHead className="text-gray-400">Date</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction: TransactionRecord) => {
                const TransactionIcon = getTransactionIcon(transaction.type);
                const iconClass = getTransactionIconClass(transaction.type);
                const isPendingWithdrawal = transaction.type === 'withdraw' && transaction.status === 'pending';
                
                return (
                  <TableRow key={transaction.id} className="border-gray-700 hover:bg-gray-800/20">
                    {pendingWithdrawals.length > 0 && (
                      <TableCell className="text-center">
                        {isPendingWithdrawal && (
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-600 text-amber-500 focus:ring-amber-500"
                            checked={selectedTransactions.includes(transaction.id)}
                            onChange={() => handleSelectTransaction(transaction.id)}
                          />
                        )}
                      </TableCell>
                    )}
                    <TableCell className="font-medium text-gray-300">
                      {transaction.userName || 'Unknown User'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-md ${iconClass}`}>
                          <TransactionIcon className="h-4 w-4" />
                        </div>
                        <span className="capitalize text-gray-300">{transaction.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {formatDate(transaction.timestamp)}
                    </TableCell>
                    <TableCell>
                      {renderTransactionStatus(transaction.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <button className="p-1 rounded-md hover:bg-gray-700">
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-1 py-8 text-gray-400">
                    <p>No transactions found</p>
                    <p className="text-sm text-gray-500">Try changing the filters or check back later</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
