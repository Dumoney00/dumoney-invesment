
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";

const EmptyTransactionState: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={4} className="text-center py-10 text-gray-400">
        No transactions found
      </TableCell>
    </TableRow>
  );
};

export default EmptyTransactionState;
