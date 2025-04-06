
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
    </div>
  );
};

export default CurrentBalanceDisplay;
