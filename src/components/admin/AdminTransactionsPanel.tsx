
import React, { useState } from 'react';
import { TransactionRecord } from '@/types/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar } from 'lucide-react';
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
import TransactionTypeLabel from '@/components/transaction/TransactionTypeLabel';
import TransactionStatus from '@/components/transaction/TransactionStatus';
import { formatDate } from '@/utils/dateUtils';

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
    status: 'completed',
    details: 'Withdrawal to UPI',
    userId: 'usr_456',
    userName: 'Jane Smith',
    upiId: 'jane@upi',
    withdrawalTime: new Date(Date.now() - 86400000).toISOString()
  }
];

const AdminTransactionsPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [transactions] = useState<TransactionRecord[]>(mockTransactions);
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);

  // Filter transactions based on search term and filter
  const filteredTransactions = transactions.filter(transaction => {
    // First apply type filter
    if (filter !== 'all' && transaction.type !== filter) {
      return false;
    }
    
    // Then apply search term
    return (
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.details?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const toggleExpandTransaction = (transactionId: string) => {
    setExpandedTransaction(expandedTransaction === transactionId ? null : transactionId);
  };

  return (
    <div className="bg-[#222222] rounded-lg p-4">
      <div className="flex items-center gap-3 mb-6">
        <Input
          placeholder="Search transactions by ID, user, or details"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-[#333333] border-gray-700 text-white"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px] bg-[#333333] border-gray-700 text-white">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-[#333333] border-gray-700 text-white">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="deposit">Deposits</SelectItem>
            <SelectItem value="withdraw">Withdrawals</SelectItem>
            <SelectItem value="purchase">Purchases</SelectItem>
            <SelectItem value="sale">Sales</SelectItem>
            <SelectItem value="dailyIncome">Daily Income</SelectItem>
            <SelectItem value="referralBonus">Referral Bonus</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" className="text-gray-400">
          <Search size={18} />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">Transaction ID</TableHead>
              <TableHead className="text-gray-300">User</TableHead>
              <TableHead className="text-gray-300">Type</TableHead>
              <TableHead className="text-gray-300 text-right">Amount</TableHead>
              <TableHead className="text-gray-300">Date</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Details</TableHead>
              <TableHead className="text-gray-300"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map(transaction => (
              <React.Fragment key={transaction.id}>
                <TableRow 
                  className={expandedTransaction === transaction.id ? "bg-[#2a2a2a]" : ""}
                >
                  <TableCell className="text-white font-mono">{transaction.id.substring(0, 8)}</TableCell>
                  <TableCell className="text-white">
                    {transaction.userName || 'Unknown'} 
                    <div className="text-xs text-gray-400 font-mono">{transaction.userId?.substring(0, 8)}</div>
                  </TableCell>
                  <TableCell>
                    <TransactionTypeLabel type={transaction.type} />
                  </TableCell>
                  <TableCell className="text-right text-white">
                    ₹{transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-white">
                    {formatDate(transaction.timestamp)}
                  </TableCell>
                  <TableCell>
                    <TransactionStatus status={transaction.status} />
                  </TableCell>
                  <TableCell className="text-white text-sm max-w-[200px] truncate">
                    {transaction.details || 'No details'}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleExpandTransaction(transaction.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Calendar size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
                
                {expandedTransaction === transaction.id && (
                  <TableRow className="bg-[#2a2a2a]">
                    <TableCell colSpan={8} className="px-8 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {transaction.type === 'withdraw' && (
                          <div className="space-y-2">
                            <h4 className="text-white font-medium">Withdrawal Details</h4>
                            {transaction.bankDetails && (
                              <div className="space-y-1 text-sm">
                                <p className="text-gray-300">
                                  <span className="text-gray-400">Account Holder:</span> {transaction.bankDetails.accountHolderName}
                                </p>
                                <p className="text-gray-300">
                                  <span className="text-gray-400">Account Number:</span> {transaction.bankDetails.accountNumber}
                                </p>
                                <p className="text-gray-300">
                                  <span className="text-gray-400">IFSC Code:</span> {transaction.bankDetails.ifscCode}
                                </p>
                              </div>
                            )}
                            {transaction.upiId && (
                              <p className="text-gray-300 text-sm">
                                <span className="text-gray-400">UPI ID:</span> {transaction.upiId}
                              </p>
                            )}
                            {transaction.withdrawalTime && (
                              <p className="text-gray-300 text-sm">
                                <span className="text-gray-400">Withdrawal Time:</span> {formatDate(transaction.withdrawalTime)}
                              </p>
                            )}
                          </div>
                        )}
                        
                        {transaction.type === 'purchase' && (
                          <div className="space-y-2">
                            <h4 className="text-white font-medium">Product Details</h4>
                            {transaction.productId && (
                              <p className="text-gray-300 text-sm">
                                <span className="text-gray-400">Product ID:</span> {transaction.productId}
                              </p>
                            )}
                            {transaction.productName && (
                              <p className="text-gray-300 text-sm">
                                <span className="text-gray-400">Product Name:</span> {transaction.productName}
                              </p>
                            )}
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <h4 className="text-white font-medium">Additional Information</h4>
                          <p className="text-gray-300 text-sm">
                            <span className="text-gray-400">Transaction ID:</span> {transaction.id}
                          </p>
                          <p className="text-gray-300 text-sm">
                            <span className="text-gray-400">Timestamp:</span> {new Date(transaction.timestamp).toLocaleString()}
                          </p>
                          {transaction.details && (
                            <p className="text-gray-300 text-sm">
                              <span className="text-gray-400">Details:</span> {transaction.details}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
            
            {filteredTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                  No transactions found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminTransactionsPanel;
