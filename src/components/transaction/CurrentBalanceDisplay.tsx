
import React from 'react';
import { User } from '@/types/auth';
import { Wallet } from 'lucide-react';

interface CurrentBalanceDisplayProps {
  user: User | null;
  balance?: number;
  isWithdrawalWallet?: boolean;
}

const CurrentBalanceDisplay: React.FC<CurrentBalanceDisplayProps> = ({ 
  user, 
  balance,
  isWithdrawalWallet = false
}) => {
  const displayBalance = balance !== undefined ? balance : 
    (isWithdrawalWallet ? user?.withdrawalBalance : user?.balance) || 0;
  
  return (
    <div className="bg-[#222222] rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Wallet className="text-investment-gold" />
          <span className="text-gray-400">
            {isWithdrawalWallet ? 'Available for Withdrawal' : 'Deposit Wallet'}
          </span>
        </div>
        <span className="text-investment-gold text-xl font-bold">
          ₹{displayBalance.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default CurrentBalanceDisplay;
