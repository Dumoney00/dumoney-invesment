
import React from 'react';
import { TransactionRecord } from '@/types/auth';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate } from '@/utils/dateUtils';
import TransactionTypeLabel from '@/components/transaction/TransactionTypeLabel';
import TransactionStatus from '@/components/transaction/TransactionStatus';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TransactionTableProps {
  transactions: TransactionRecord[];
  selectedTransactions: string[];
  pendingWithdrawals: TransactionRecord[];
  onSelectTransaction: (id: string) => void;
  onSelectAll: () => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  selectedTransactions,
  pendingWithdrawals,
  onSelectTransaction,
  onSelectAll,
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-[#1A1F2C]/50">
          <TableRow className="border-[#33374D] hover:bg-[#1A1F2C]/70">
            {pendingWithdrawals.length > 0 && (
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedTransactions.length === pendingWithdrawals.length && pendingWithdrawals.length > 0}
                  onCheckedChange={onSelectAll}
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
          {transactions.map(transaction => (
            <TableRow key={transaction.id} className="border-[#33374D] hover:bg-[#1A1F2C]/70">
              {pendingWithdrawals.length > 0 && (
                <TableCell>
                  {transaction.type === 'withdraw' && transaction.status === 'pending' && (
                    <Checkbox
                      checked={selectedTransactions.includes(transaction.id)}
                      onCheckedChange={() => onSelectTransaction(transaction.id)}
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
          {transactions.length === 0 && (
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
  );
};

export default TransactionTable;
