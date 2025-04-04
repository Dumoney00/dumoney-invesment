
import React from 'react';
import { User } from '@/contexts/AuthContext';

interface AccountStatsProps {
  user: User;
}

const AccountStats: React.FC<AccountStatsProps> = ({ user }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-[#222222] p-4 rounded-lg flex flex-col items-center">
        <p className="text-investment-gold text-xl font-bold">₹{user.balance.toFixed(2)}</p>
        <p className="text-gray-400 text-xs">Total assets</p>
      </div>
      <div className="bg-[#222222] p-4 rounded-lg flex flex-col items-center">
        <p className="text-investment-gold text-xl font-bold">₹{user.totalDeposit.toFixed(2)}</p>
        <p className="text-gray-400 text-xs">Total Deposit</p>
      </div>
      <div className="bg-[#222222] p-4 rounded-lg flex flex-col items-center">
        <p className="text-investment-gold text-xl font-bold">₹{user.totalWithdraw.toFixed(2)}</p>
        <p className="text-gray-400 text-xs">Total Withdraw</p>
      </div>
    </div>
  );
};

export default AccountStats;
