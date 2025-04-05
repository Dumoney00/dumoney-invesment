
import React from 'react';
import { User } from '@/types/auth';
import { WalletCards, TrendingUp, ArrowDown } from 'lucide-react';

interface AccountStatsProps {
  user: User;
}

const AccountStats: React.FC<AccountStatsProps> = ({ user }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-[#222222] p-4 rounded-lg flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center mb-2">
          <WalletCards size={20} className="text-green-500" />
        </div>
        <p className="text-investment-gold text-xl font-bold">₹{user.balance.toFixed(2)}</p>
        <p className="text-gray-400 text-xs">Available</p>
      </div>
      <div className="bg-[#222222] p-4 rounded-lg flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mb-2">
          <TrendingUp size={20} className="text-blue-500" />
        </div>
        <p className="text-investment-gold text-xl font-bold">₹{user.totalDeposit.toFixed(2)}</p>
        <p className="text-gray-400 text-xs">Deposited</p>
      </div>
      <div className="bg-[#222222] p-4 rounded-lg flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center mb-2">
          <ArrowDown size={20} className="text-red-500" />
        </div>
        <p className="text-investment-gold text-xl font-bold">₹{user.totalWithdraw.toFixed(2)}</p>
        <p className="text-gray-400 text-xs">Withdrawn</p>
      </div>
    </div>
  );
};

export default AccountStats;
