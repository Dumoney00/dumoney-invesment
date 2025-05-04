
import React from 'react';
import { Button } from "@/components/ui/button";

interface TransactionButtonProps {
  isProcessing: boolean;
  isDeposit: boolean;
  isWithdrawalTime?: boolean; // Made optional
}

const TransactionButton: React.FC<TransactionButtonProps> = ({ 
  isProcessing, 
  isDeposit, 
  isWithdrawalTime = true // Default to true so withdrawals are always available
}) => {
  return (
    <Button
      type="submit"
      className="w-full bg-investment-gold hover:bg-investment-gold/90 py-6 text-lg"
      disabled={isProcessing}
    >
      {isProcessing 
        ? "Processing..." 
        : isDeposit 
          ? "Deposit Funds"
          : "Withdraw Funds"
      }
    </Button>
  );
};

export default TransactionButton;
