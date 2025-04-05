
import React from 'react';
import { User } from '@/types/auth';
import { WalletCards, ArrowDown, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AccountSummaryProps {
  user: User | null;
}

const AccountSummary: React.FC<AccountSummaryProps> = ({ user }) => {
  const navigate = useNavigate();
  
  const handleDepositClick = () => {
    navigate('/deposit');
  };
  
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="bg-gradient-to-r from-investment-gold to-yellow-500 rounded-xl p-4">
        <div className="flex flex-col">
          <span className="text-white text-sm mb-2">Available balance</span>
          <div className="flex items-center gap-2">
            <WalletCards className="text-white" size={20} />
            <span className="text-white font-bold text-2xl">₹{user?.balance?.toFixed(2) || "0.00"}</span>
          </div>
        </div>
      </div>
      
      <div 
        className="bg-gradient-to-r from-investment-gold to-yellow-500 rounded-xl p-4 relative cursor-pointer"
        onClick={handleDepositClick}
      >
        <div className="flex flex-col">
          <span className="text-white text-sm mb-2">Total deposits</span>
          <div className="flex items-center gap-2">
            <TrendingUp className="text-white" size={20} />
            <span className="text-white font-bold text-2xl">₹{user?.totalDeposit?.toFixed(2) || "0.00"}</span>
          </div>
        </div>
        <div className="absolute right-2 bottom-2 bg-white/20 p-1 rounded-full">
          <span className="text-xs text-white font-bold">+</span>
        </div>
      </div>
    </div>
  );
};

export default AccountSummary;
