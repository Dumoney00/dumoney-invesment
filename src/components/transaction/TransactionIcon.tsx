
import React from 'react';
import { Wallet, CreditCard } from 'lucide-react';

interface TransactionIconProps {
  isDeposit: boolean;
}

const TransactionIcon: React.FC<TransactionIconProps> = ({ isDeposit }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="h-20 w-20 rounded-full bg-[#222222] flex items-center justify-center">
        {isDeposit ? (
          <Wallet size={40} className="text-investment-gold" />
        ) : (
          <CreditCard size={40} className="text-investment-gold" />
        )}
      </div>
    </div>
  );
};

export default TransactionIcon;
