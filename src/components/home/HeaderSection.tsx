
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Wallet } from "lucide-react";

const HeaderSection: React.FC = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(user?.balance || 0);
  const [withdrawalBalance, setWithdrawalBalance] = useState(user?.withdrawalBalance || 0);
  
  // Update balances whenever user changes
  useEffect(() => {
    if (user) {
      setBalance(user.balance);
      setWithdrawalBalance(user.withdrawalBalance);
    }
  }, [user]);

  return (
    <>
      <header className="bg-[#333333] py-4 relative">
        <h1 className="text-xl text-center font-bold text-yellow-500">DUMONEY INVEST</h1>
        {user && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Wallet className="text-investment-gold" size={18} />
            <span className="text-investment-gold font-medium">₹{balance.toFixed(2)}</span>
          </div>
        )}
      </header>
      <div className="bg-investment-yellow h-2"></div>
    </>
  );
};

export default HeaderSection;
