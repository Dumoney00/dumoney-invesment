
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { TransactionRecord } from "@/types/auth";
import TransactionTypeLabel from './TransactionTypeLabel';
import TransactionAmount from './TransactionAmount';
import TransactionStatus from './TransactionStatus';

interface TransactionRowProps {
  transaction: TransactionRecord;
  formatDate: (dateString: string) => string;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction, formatDate }) => {
  return (
    <TableRow key={transaction.id} className="border-gray-700">
      <TableCell>
        <div>
          <TransactionTypeLabel type={transaction.type} />
          <p className="text-xs text-gray-400 md:hidden">{formatDate(transaction.timestamp)}</p>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div>
          <TransactionAmount 
            type={transaction.type} 
            amount={transaction.amount} 
          />
          <p className="text-xs text-gray-400 md:hidden">{transaction.status}</p>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell text-gray-300">
        {formatDate(transaction.timestamp)}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <TransactionStatus status={transaction.status} />
      </TableCell>
    </TableRow>
  );
};

export default TransactionRow;
