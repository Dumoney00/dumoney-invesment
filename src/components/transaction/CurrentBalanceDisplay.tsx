
import React from 'react';
import { User } from '@/types/auth';
import { Wallet, Coins } from 'lucide-react';

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
  const dailyIncome = user?.dailyIncome || 0;
  
  return (
    <div className="bg-[#222222] rounded-lg p-4 mb-4">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wallet className="text-investment-gold" />
            <span className="text-gray-400">
              {isWithdrawalWallet ? 'Earnings Wallet' : 'Deposit Wallet'}
            </span>
          </div>
          <span className="text-investment-gold text-xl font-bold">
            ₹{displayBalance.toFixed(2)}
          </span>
        </div>
        
        {isWithdrawalWallet && (
          <div className="flex justify-between items-center pt-2 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <Coins className="text-green-400" />
              <span className="text-gray-400">Daily Earnings</span>
            </div>
            <span className="text-green-400 text-lg">
              +₹{dailyIncome.toFixed(2)}/day
            </span>
          </div>
        )}
        
        {isWithdrawalWallet && (
          <p className="text-sm text-gray-500 mt-1">
            You can withdraw your earnings from this wallet during withdrawal hours
          </p>
        )}
      </div>
    </div>
  );
};

export default CurrentBalanceDisplay;
