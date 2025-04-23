
import React from 'react';
import { User } from '@/types/auth';
import { Wallet } from 'lucide-react';

interface CurrentBalanceDisplayProps {
  user: User | null;
}

const CurrentBalanceDisplay: React.FC<CurrentBalanceDisplayProps> = ({ user }) => {
  return (
    <div className="bg-[#222222] rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Wallet className="text-investment-gold" />
          <span className="text-gray-400">Available Balance</span>
        </div>
        <span className="text-investment-gold text-xl font-bold">
          ₹{user?.balance.toFixed(2) || '0.00'}
        </span>
      </div>
    </div>
  );
};

export default CurrentBalanceDisplay;
