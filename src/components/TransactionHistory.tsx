
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import TransactionRow from './transaction/TransactionRow';
import EmptyTransactionState from './transaction/EmptyTransactionState';
import { formatDate } from '@/utils/dateUtils';

const TransactionHistory: React.FC = () => {
  const { user } = useAuth();
  
  // Get actual transactions from user if available
  const transactions = user?.transactions || [];
  
  return (
    <div className="rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-300">Type</TableHead>
            <TableHead className="text-gray-300 text-right">Amount</TableHead>
            <TableHead className="text-gray-300 hidden md:table-cell">Date</TableHead>
            <TableHead className="text-gray-300 hidden md:table-cell">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TransactionRow 
                key={transaction.id}
                transaction={transaction} 
                formatDate={formatDate}
              />
            ))
          ) : (
            <EmptyTransactionState />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionHistory;
