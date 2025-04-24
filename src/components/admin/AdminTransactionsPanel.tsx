
import React, { useState } from 'react';
import { TransactionRecord } from '@/types/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Check, Filter, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { showToast } from '@/utils/toastUtils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TransactionTypeLabel from '@/components/transaction/TransactionTypeLabel';
import TransactionStatus from '@/components/transaction/TransactionStatus';
import { formatDate } from '@/utils/dateUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Enhanced mock transactions data for development
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

  // Filter transactions based on search term, type filter and status filter
  const filteredTransactions = transactions.filter(transaction => {
    // First apply type filter
    if (filter !== 'all' && transaction.type !== filter) {
      return false;
    }
    
    // Then apply status filter
    if (statusFilter !== 'all' && transaction.status !== statusFilter) {
      return false;
    }
    
    // Then apply search term
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
      // In a real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
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

  // Filter only withdrawal transactions that are pending
  const pendingWithdrawals = filteredTransactions.filter(
    t => t.type === 'withdraw' && t.status === 'pending'
  );

  // Transaction Stats
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
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#222B45]/80 border-[#33374D]">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Transactions</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{totalTransactions}</h3>
              </div>
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Filter size={24} className="text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#222B45]/80 border-[#33374D]">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending Approvals</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{pendingTransactions}</h3>
              </div>
              <div className="bg-amber-500/20 p-2 rounded-lg">
                <Check size={24} className="text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#222B45]/80 border-[#33374D]">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Deposits</p>
                <h3 className="text-2xl font-bold mt-1 text-white">₹{totalDeposits.toLocaleString()}</h3>
              </div>
              <div className="bg-green-500/20 p-2 rounded-lg">
                <Download size={24} className="text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#222B45]/80 border-[#33374D]">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Withdrawals</p>
                <h3 className="text-2xl font-bold mt-1 text-white">₹{totalWithdrawals.toLocaleString()}</h3>
              </div>
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Download size={24} className="text-purple-500 rotate-180" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="bg-[#222B45]/80 border-[#33374D]">
        <CardHeader className="pb-3">
          <CardTitle className="text-white">Transaction Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-[#1A1F2C] border-[#33374D] text-white pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[150px] bg-[#1A1F2C] border-[#33374D] text-white">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1F2C] border-[#33374D] text-white">
                  <SelectItem value="all" className="hover:bg-[#33374D]">All Types</SelectItem>
                  <SelectItem value="withdraw" className="hover:bg-[#33374D]">Withdrawals</SelectItem>
                  <SelectItem value="deposit" className="hover:bg-[#33374D]">Deposits</SelectItem>
                  <SelectItem value="purchase" className="hover:bg-[#33374D]">Purchases</SelectItem>
                  <SelectItem value="sale" className="hover:bg-[#33374D]">Sales</SelectItem>
                  <SelectItem value="dailyIncome" className="hover:bg-[#33374D]">Daily Income</SelectItem>
                  <SelectItem value="referralBonus" className="hover:bg-[#33374D]">Referral Bonus</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] bg-[#1A1F2C] border-[#33374D] text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1F2C] border-[#33374D] text-white">
                  <SelectItem value="all" className="hover:bg-[#33374D]">All Status</SelectItem>
                  <SelectItem value="pending" className="hover:bg-[#33374D]">Pending</SelectItem>
                  <SelectItem value="completed" className="hover:bg-[#33374D]">Completed</SelectItem>
                  <SelectItem value="failed" className="hover:bg-[#33374D]">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {pendingWithdrawals.length > 0 && (
              <div className="flex items-center gap-3 w-full md:w-auto">
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
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#1A1F2C]/50">
                <TableRow className="border-[#33374D] hover:bg-[#1A1F2C]/70">
                  {pendingWithdrawals.length > 0 && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedTransactions.length === pendingWithdrawals.length && pendingWithdrawals.length > 0}
                        onCheckedChange={handleSelectAll}
                        className="border-gray-500"
                      />
                    </TableHead>
                  )}
                  <TableHead className="text-gray-400">Transaction ID</TableHead>
                  <TableHead className="text-gray-400">User</TableHead>
                  <TableHead className="text-gray-400">Type</TableHead>
                  <TableHead className="text-gray-400 text-right">Amount</TableHead>
                  <TableHead className="text-gray-400">Date</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Details</TableHead>
                  <TableHead className="text-gray-400">Bank/UPI Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map(transaction => (
                  <TableRow key={transaction.id} className="border-[#33374D] hover:bg-[#1A1F2C]/70">
                    {pendingWithdrawals.length > 0 && (
                      <TableCell>
                        {transaction.type === 'withdraw' && transaction.status === 'pending' && (
                          <Checkbox
                            checked={selectedTransactions.includes(transaction.id)}
                            onCheckedChange={() => handleSelectTransaction(transaction.id)}
                            className="border-gray-500"
                          />
                        )}
                      </TableCell>
                    )}
                    <TableCell className="text-gray-300 font-mono">{transaction.id.substring(0, 8)}</TableCell>
                    <TableCell className="text-gray-300">
                      {transaction.userName || 'Unknown'}
                      <div className="text-xs text-gray-500 font-mono">
                        {transaction.userId?.substring(0, 8)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <TransactionTypeLabel type={transaction.type} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium text-gray-300">₹{transaction.amount.toLocaleString()}</div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {formatDate(transaction.timestamp)}
                    </TableCell>
                    <TableCell>
                      <TransactionStatus status={transaction.status} />
                    </TableCell>
                    <TableCell className="text-gray-300 text-sm max-w-[200px] truncate">
                      {transaction.details || 'No details'}
                    </TableCell>
                    <TableCell className="text-gray-300 text-sm">
                      {transaction.type === 'withdraw' && (
                        <div className="space-y-1">
                          {transaction.bankDetails && (
                            <>
                              <div className="text-sm">{transaction.bankDetails.accountHolderName}</div>
                              <div className="text-xs text-gray-400">
                                AC: {transaction.bankDetails.accountNumber}
                              </div>
                              <div className="text-xs text-gray-400">
                                IFSC: {transaction.bankDetails.ifscCode}
                              </div>
                            </>
                          )}
                          {transaction.upiId && (
                            <div className="text-xs text-gray-400">
                              UPI: {transaction.upiId}
                            </div>
                          )}
                          {transaction.withdrawalTime && (
                            <div className="text-xs text-gray-400">
                              Requested: {formatDate(transaction.withdrawalTime)}
                            </div>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredTransactions.length === 0 && (
                  <TableRow className="border-[#33374D]">
                    <TableCell 
                      colSpan={pendingWithdrawals.length > 0 ? 9 : 8} 
                      className="text-center py-8 text-gray-400"
                    >
                      No transactions found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransactionsPanel;
