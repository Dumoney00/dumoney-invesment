
import React from 'react';
import { TransactionRecord } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface BulkActionsProps {
  selectedTransactions: string[];
  isApproving: boolean;
  onApprove: () => void;
  pendingWithdrawals: TransactionRecord[];
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedTransactions,
  isApproving,
  onApprove,
  pendingWithdrawals
}) => {
  if (pendingWithdrawals.length === 0) return null;

  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-gray-400 text-sm">
        {selectedTransactions.length} selected
      </span>
      <Button
        onClick={onApprove}
        disabled={selectedTransactions.length === 0 || isApproving}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <Check size={16} className="mr-2" />
        {isApproving ? "Processing..." : "Approve Selected"}
      </Button>
    </div>
  );
};

export default BulkActions;
