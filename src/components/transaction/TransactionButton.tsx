
import React from 'react';
import { Button } from "@/components/ui/button";

interface TransactionButtonProps {
  isProcessing: boolean;
  isDeposit: boolean;
  isWithdrawalTime: boolean;
  paymentMethod: string;
}

const TransactionButton: React.FC<TransactionButtonProps> = ({ 
  isProcessing, 
  isDeposit, 
  isWithdrawalTime,
  paymentMethod
}) => {
  return (
    <Button
      type="submit"
      className="w-full bg-investment-gold hover:bg-investment-gold/90 py-6 text-lg"
      disabled={isProcessing || (!isDeposit && !isWithdrawalTime)}
    >
      {isProcessing 
        ? "Processing..." 
        : isDeposit 
          ? paymentMethod === "paytm"
            ? "Continue to Paytm"
            : "Deposit Funds" 
          : "Withdraw Funds"
      }
    </Button>
  );
};

export default TransactionButton;
