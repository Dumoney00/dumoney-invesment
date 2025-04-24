
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';

interface EmptyTransactionRowProps {
  colSpan: number;
}

const EmptyTransactionRow: React.FC<EmptyTransactionRowProps> = ({ colSpan }) => {
  return (
    <TableRow className="border-[#33374D]">
      <TableCell 
        colSpan={colSpan}
        className="text-center py-8 text-gray-400"
      >
        No transactions found matching your criteria
      </TableCell>
    </TableRow>
  );
};

export default EmptyTransactionRow;
