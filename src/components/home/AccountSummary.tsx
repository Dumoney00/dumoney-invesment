
import React from 'react';
import { User } from '@/types/auth';

interface AccountSummaryProps {
  user: User | null;
}

const AccountSummary: React.FC<AccountSummaryProps> = ({ user }) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="bg-gradient-to-r from-investment-gold to-yellow-500 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white text-2xl"></span>
          <span className="text-white font-bold text-2xl">₹{user?.balance?.toFixed(2) || "0.00"}</span>
        </div>
        <p className="text-white text-sm">Account balance</p>
      </div>
      
      <div className="bg-gradient-to-r from-investment-gold to-yellow-500 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white text-2xl font-normal text-justify">
        </span>
          <span className="text-white font-bold text-2xl">₹{user?.totalDeposit?.toFixed(2) || "0.00"}</span>
        </div>
        <p className="text-white text-sm">Total Deposit</p>
      </div>
    </div>
  );
};

export default AccountSummary;
