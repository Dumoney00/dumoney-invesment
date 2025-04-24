
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { TransactionRecord } from '@/types/auth';
import TransactionTypeLabel from '@/components/transaction/TransactionTypeLabel';
import TransactionStatus from '@/components/transaction/TransactionStatus';
import { formatDate } from '@/utils/dateUtils';

interface AdminTransactionRowProps {
  transaction: TransactionRecord;
  showCheckbox: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const AdminTransactionRow: React.FC<AdminTransactionRowProps> = ({
  transaction,
  showCheckbox,
  isSelected,
  onSelect,
}) => {
  return (
    <TableRow key={transaction.id} className="border-[#33374D] hover:bg-[#1A1F2C]/70">
      {showCheckbox && (
        <TableCell>
          {transaction.type === 'withdraw' && transaction.status === 'pending' && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect(transaction.id)}
              className="border-gray-500"
            />
          )}
        </TableCell>
      )}
      <TableCell className="text-gray-300 font-mono">
        {transaction.id.substring(0, 8)}
      </TableCell>
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
  );
};

export default AdminTransactionRow;
