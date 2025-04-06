
import React from 'react';
import { User } from '@/types/auth';

interface CurrentBalanceDisplayProps {
  user: User | null;
}

const CurrentBalanceDisplay: React.FC<CurrentBalanceDisplayProps> = ({ user }) => {
  return (
    <div className="bg-[#222222] rounded-lg p-4 mb-6">
      <p className="text-gray-400 text-center text-sm">Available Balance</p>
      <p className="text-investment-gold text-center text-3xl font-bold">
        ₹{user?.balance.toFixed(2) || '0.00'}
      </p>
      {user && (
        <div className="mt-2 border-t border-gray-700 pt-2">
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">Total Deposits:</p>
            <p className="text-green-400 font-medium">₹{user.totalDeposit.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center mt-1">
            <p className="text-gray-400 text-sm">Total Withdrawals:</p>
            <p className="text-red-400 font-medium">₹{user.totalWithdraw.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentBalanceDisplay;
