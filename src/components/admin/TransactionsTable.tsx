
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
import { TransactionRecord, TransactionType } from "@/types/auth";
import { Check, MoreHorizontal, X, Filter, Eye } from "lucide-react";
import { getTransactionIcon, getTransactionIconClass } from "@/utils/transactionUtils";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatUtils";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export const TransactionsTable = () => {
  const { transactions, loading, refreshData } = useAllUserTransactions();
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdraw' | 'pending' | 'completed' | 'account_activity'>('all');
  const { selectedTransactions, isApproving, handleSelectTransaction, handleSelectAll, handleApproveWithdrawals } = useTransactionManagement();
  
  // Filter and sort transactions
  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'deposit') return t.type === 'deposit';
    if (filter === 'withdraw') return t.type === 'withdraw';
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'completed') return t.status === 'completed';
    if (filter === 'account_activity') return ['account_created', 'account_activity', 'account_update', 'account_security'].includes(t.type);
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
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-500/20 text-gray-500 text-xs font-medium">
            Unknown
          </span>
        );
    }
  };
  
  const renderTransactionType = (type: string) => {
    const typeMap: Record<string, {color: string, label: string}> = {
      'deposit': { color: 'bg-emerald-500/20 text-emerald-500', label: 'Deposit' },
      'withdraw': { color: 'bg-amber-500/20 text-amber-500', label: 'Withdraw' },
      'purchase': { color: 'bg-blue-500/20 text-blue-500', label: 'Purchase' },
      'sale': { color: 'bg-purple-500/20 text-purple-500', label: 'Sale' },
      'dailyIncome': { color: 'bg-cyan-500/20 text-cyan-500', label: 'Daily Income' },
      'referralBonus': { color: 'bg-pink-500/20 text-pink-500', label: 'Referral Bonus' },
      'account_created': { color: 'bg-teal-500/20 text-teal-500', label: 'Account Created' },
      'account_activity': { color: 'bg-violet-500/20 text-violet-500', label: 'Account Activity' },
      'account_update': { color: 'bg-indigo-500/20 text-indigo-500', label: 'Profile Update' },
      'account_security': { color: 'bg-red-500/20 text-red-500', label: 'Security Action' }
    };
    
    const { color, label } = typeMap[type] || { color: 'bg-gray-500/20 text-gray-500', label: type };
    
    return (
      <Badge variant="outline" className={`${color} border-current/30`}>
        {label}
      </Badge>
    );
  };
  
  if (loading) {
    return <div className="text-center py-10">Loading transactions...</div>;
  }
  
  // Mobile filter drawer component
  const FilterDrawer = () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-gray-900 text-white p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-2">Filter Transactions</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              onClick={() => setFilter('all')}
              className="w-full"
            >
              All
            </Button>
            <Button 
              variant={filter === 'deposit' ? 'default' : 'outline'} 
              onClick={() => setFilter('deposit')}
              className="w-full"
            >
              Deposits
            </Button>
            <Button 
              variant={filter === 'withdraw' ? 'default' : 'outline'} 
              onClick={() => setFilter('withdraw')}
              className="w-full"
            >
              Withdrawals
            </Button>
            <Button 
              variant={filter === 'pending' ? 'default' : 'outline'} 
              onClick={() => setFilter('pending')}
              className="w-full"
            >
              Pending
            </Button>
            <Button 
              variant={filter === 'completed' ? 'default' : 'outline'} 
              onClick={() => setFilter('completed')}
              className="w-full"
            >
              Completed
            </Button>
            <Button 
              variant={filter === 'account_activity' ? 'default' : 'outline'} 
              onClick={() => setFilter('account_activity')}
              className="w-full"
            >
              User Activity
            </Button>
          </div>
          
          {pendingWithdrawals.length > 0 && (
            <Button 
              className="w-full bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500 hover:text-white"
              disabled={isApproving || selectedTransactions.length === 0}
              onClick={() => handleApproveWithdrawals(selectedTransactions, "admin-user")}
            >
              {isApproving ? 'Processing...' : `Approve (${selectedTransactions.length})`}
            </Button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
  
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900/50 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4 bg-gray-800/50 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium text-gray-200">Transactions & Activities</h3>
          <div className="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-1 rounded-full">
            {filteredTransactions.length}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Mobile filter drawer */}
          <FilterDrawer />
          
          {/* Desktop filters */}
          <div className="hidden md:flex items-center bg-gray-800 rounded-lg p-0.5">
            <button 
              className={`px-3 py-1 text-sm rounded-md transition-colors ${filter === 'all' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-gray-200'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md transition-colors ${filter === 'deposit' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-gray-200'}`}
              onClick={() => setFilter('deposit')}
            >
              Deposits
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md transition-colors ${filter === 'withdraw' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-gray-200'}`}
              onClick={() => setFilter('withdraw')}
            >
              Withdrawals
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
            <button 
              className={`px-3 py-1 text-sm rounded-md transition-colors ${filter === 'account_activity' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-gray-200'}`}
              onClick={() => setFilter('account_activity')}
            >
              User Activity
            </button>
          </div>
          
          {pendingWithdrawals.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              className="bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500 hover:text-white hidden md:flex"
              disabled={isApproving || selectedTransactions.length === 0}
              onClick={() => handleApproveWithdrawals(selectedTransactions, "admin-user")}
            >
              {isApproving ? 'Processing...' : `Approve (${selectedTransactions.length})`}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            className="bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
            onClick={refreshData}
          >
            Refresh
          </Button>
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
              <TableHead className="text-gray-400 hidden md:table-cell">Date/Time</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400 text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction: TransactionRecord) => {
                const TransactionIcon = getTransactionIcon(transaction.type as TransactionType);
                const iconClass = getTransactionIconClass(transaction.type as TransactionType);
                const isPendingWithdrawal = transaction.type === 'withdraw' && transaction.status === 'pending';
                const isAccountActivity = ['account_created', 'account_activity', 'account_update', 'account_security'].includes(transaction.type);
                
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
                      <div className="flex flex-col">
                        <span>{transaction.userName || 'Unknown User'}</span>
                        <span className="text-xs text-gray-500 md:hidden">{formatDate(transaction.timestamp)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!isAccountActivity ? (
                          <div className={`p-1 rounded-md ${iconClass}`}>
                            <TransactionIcon className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="p-1 rounded-md bg-purple-500/20 text-purple-500">
                            <Eye className="h-4 w-4" />
                          </div>
                        )}
                        {renderTransactionType(transaction.type)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {isAccountActivity ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        formatCurrency(transaction.amount)
                      )}
                    </TableCell>
                    <TableCell className="text-gray-400 hidden md:table-cell">
                      {formatDate(transaction.timestamp)}
                    </TableCell>
                    <TableCell>
                      {renderTransactionStatus(transaction.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4 text-gray-400" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-sm">{transaction.details || 'No additional details'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={pendingWithdrawals.length > 0 ? 7 : 6} className="h-24 text-center">
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
