
import React, { useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import { Wallet, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccountSummaryProps {
  user: User | null;
}

const AccountSummary: React.FC<AccountSummaryProps> = ({ user }) => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(user?.balance || 0);
  const [withdrawalBalance, setWithdrawalBalance] = useState(user?.withdrawalBalance || 0);
  
  // Update balances whenever user changes
  useEffect(() => {
    if (user) {
      setBalance(user.balance);
      setWithdrawalBalance(user.withdrawalBalance);
    }
  }, [user]);

  const handleWalletClick = () => {
    navigate('/deposit');
  };

  const handleEarningsClick = () => {
    navigate('/withdraw');
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <div className="bg-[#222222] rounded-xl p-4">
        <div 
          className="flex justify-between items-center mb-3 cursor-pointer" 
          onClick={handleWalletClick}
        >
          <div className="flex items-center gap-2">
            <Wallet className="text-investment-gold" />
            <h2 className="text-white font-medium">Deposit Wallet</h2>
          </div>
          <span className="text-investment-gold text-xl font-bold">
            ₹{balance.toFixed(2)}
          </span>
        </div>
        
        <div 
          className="flex justify-between items-center mb-4 cursor-pointer"
          onClick={handleEarningsClick}
        >
          <div className="flex items-center gap-2">
            <Coins className="text-green-400" />
            <h2 className="text-white font-medium">Earnings Wallet</h2>
          </div>
          <span className="text-green-400 text-xl font-bold">
            ₹{withdrawalBalance.toFixed(2)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="bg-green-600 hover:bg-green-700 text-white border-0"
            onClick={() => navigate('/deposit')}
          >
            Deposit
          </Button>
          <Button
            variant="outline"
            className="bg-red-600 hover:bg-red-700 text-white border-0"
            onClick={() => navigate('/withdraw')}
          >
            Withdraw
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountSummary;
