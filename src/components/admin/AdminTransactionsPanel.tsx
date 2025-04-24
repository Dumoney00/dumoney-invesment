
import React, { useState } from 'react';
import { TransactionRecord } from '@/types/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
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

// Mock transactions data for development
const mockTransactions: TransactionRecord[] = [
  {
    id: 'trx_1',
    type: 'deposit',
    amount: 500,
    timestamp: new Date().toISOString(),
    status: 'completed',
    details: 'Deposit via bank transfer',
    userId: 'usr_123'
  },
  {
    id: 'trx_2',
    type: 'withdraw',
    amount: 200,
    timestamp: new Date().toISOString(),
    status: 'pending',
    details: 'Withdrawal to bank account',
    userId: 'usr_123'
  },
  {
    id: 'trx_3',
    type: 'purchase',
    amount: 1000,
    timestamp: new Date().toISOString(),
    status: 'completed',
    details: 'Investment in product ID: 1',
    userId: 'usr_456'
  },
  {
    id: 'trx_4',
    type: 'referralBonus',
    amount: 50,
    timestamp: new Date().toISOString(),
    status: 'completed',
    details: 'Referral bonus for user usr_789',
    userId: 'usr_456'
  }
];

const AdminTransactionsPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [transactions] = useState<TransactionRecord[]>(mockTransactions);

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
      transaction.details?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="bg-[#222222] rounded-lg p-4">
      <div className="flex items-center gap-3 mb-6">
        <Input
          placeholder="Search transactions by ID, user ID or details"
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
              <TableHead className="text-gray-300">User ID</TableHead>
              <TableHead className="text-gray-300">Type</TableHead>
              <TableHead className="text-gray-300 text-right">Amount</TableHead>
              <TableHead className="text-gray-300">Date</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map(transaction => (
              <TableRow key={transaction.id}>
                <TableCell className="text-white font-mono">{transaction.id.substring(0, 8)}</TableCell>
                <TableCell className="text-white font-mono">{transaction.userId?.substring(0, 8)}</TableCell>
                <TableCell>
                  <TransactionTypeLabel type={transaction.type} />
                </TableCell>
                <TableCell className="text-right text-white">
                  ${transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-white">
                  {formatDate(new Date(transaction.timestamp))}
                </TableCell>
                <TableCell>
                  <TransactionStatus status={transaction.status} />
                </TableCell>
                <TableCell className="text-white text-sm">
                  {transaction.details || 'No details'}
                </TableCell>
              </TableRow>
            ))}
            
            {filteredTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-400">
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
