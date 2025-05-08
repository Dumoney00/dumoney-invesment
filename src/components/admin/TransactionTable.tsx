
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

interface TransactionTableProps {
  transactions: any[];
  compact?: boolean;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions,
  compact = false
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-500 border-gray-500/30">{status}</Badge>;
    }
  };
  
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'deposit':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Deposit</Badge>;
      case 'withdraw':
        return <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">Withdraw</Badge>;
      case 'investment':
      case 'purchase':
        return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">Investment</Badge>;
      case 'sale':
        return <Badge className="bg-purple-500/20 text-purple-500 border-purple-500/30">Sale</Badge>;
      case 'dailyIncome':
      case 'referralBonus':
        return <Badge className="bg-indigo-500/20 text-indigo-500 border-indigo-500/30">Income</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-500 border-gray-500/30">{type}</Badge>;
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {!compact && <TableHead className="text-gray-300">ID</TableHead>}
            <TableHead className="text-gray-300">User</TableHead>
            <TableHead className="text-gray-300">Type</TableHead>
            <TableHead className="text-gray-300">Amount</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow 
              key={transaction.id}
              className="border-gray-800 hover:bg-gray-900/50"
            >
              {!compact && (
                <TableCell className="text-xs text-gray-400">
                  {transaction.id.substring(0, 8)}...
                </TableCell>
              )}
              <TableCell className="text-white">
                {transaction.username || 'User'}
              </TableCell>
              <TableCell>
                {getTypeBadge(transaction.type)}
              </TableCell>
              <TableCell className="font-mono">
                ₹{parseFloat(transaction.amount).toLocaleString('en-IN')}
              </TableCell>
              <TableCell>
                {getStatusBadge(transaction.status)}
              </TableCell>
              <TableCell className="text-gray-400">
                {formatDistanceToNow(new Date(transaction.timestamp), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
