
import React from 'react';
import { Wallet } from 'lucide-react';

interface WalletInfoProps {
  balance: number;
  hasEnoughBalance: boolean;
}

const WalletInfo: React.FC<WalletInfoProps> = ({ balance, hasEnoughBalance }) => {
  return (
    <div className="bg-black/20 p-3 rounded-lg mb-4">
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2">
          <Wallet size={16} />
          Your current balance:
        </span>
        <span className={hasEnoughBalance ? "text-investment-gold font-bold" : "text-red-500 font-bold"}>
          ₹{balance.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default WalletInfo;
