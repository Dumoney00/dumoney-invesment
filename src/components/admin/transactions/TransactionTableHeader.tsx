
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface TransactionTableHeaderProps {
  showCheckbox: boolean;
  isAllSelected: boolean;
  onSelectAll: () => void;
}

const TransactionTableHeader: React.FC<TransactionTableHeaderProps> = ({
  showCheckbox,
  isAllSelected,
  onSelectAll,
}) => {
  return (
    <TableHeader className="bg-[#1A1F2C]/50">
      <TableRow className="border-[#33374D] hover:bg-[#1A1F2C]/70">
        {showCheckbox && (
          <TableHead className="w-12">
            <Checkbox
              checked={isAllSelected}
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
  );
};

export default TransactionTableHeader;
