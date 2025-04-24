
import React from 'react';
import { TransactionRecord } from '@/types/auth';
import {
  Table,
  TableBody,
} from '@/components/ui/table';
import TransactionTableHeader from './TransactionTableHeader';
import AdminTransactionRow from './AdminTransactionRow';
import EmptyTransactionRow from './EmptyTransactionRow';

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
        <TransactionTableHeader
          showCheckbox={pendingWithdrawals.length > 0}
          isAllSelected={selectedTransactions.length === pendingWithdrawals.length && pendingWithdrawals.length > 0}
          onSelectAll={onSelectAll}
        />
        <TableBody>
          {transactions.length > 0 ? (
            transactions.map(transaction => (
              <AdminTransactionRow
                key={transaction.id}
                transaction={transaction}
                showCheckbox={pendingWithdrawals.length > 0}
                isSelected={selectedTransactions.includes(transaction.id)}
                onSelect={onSelectTransaction}
              />
            ))
          ) : (
            <EmptyTransactionRow colSpan={pendingWithdrawals.length > 0 ? 9 : 8} />
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
