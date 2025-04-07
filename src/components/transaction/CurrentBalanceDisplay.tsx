
import React from 'react';
import { User } from '@/types/auth';
import { Wallet, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CurrentBalanceDisplayProps {
  user: User | null;
}

const CurrentBalanceDisplay: React.FC<CurrentBalanceDisplayProps> = ({ user }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-[#222222] rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <Wallet size={20} className="text-investment-gold mr-2" />
          <p className="text-gray-300 text-sm font-medium">My Wallet</p>
        </div>
        <div 
          className="bg-investment-gold/20 rounded-full p-1 cursor-pointer"
          onClick={() => navigate('/deposit')}
        >
          <Plus size={16} className="text-investment-gold" />
        </div>
      </div>
      
      <p className="text-investment-gold text-center text-3xl font-bold">
        ₹{user?.balance.toFixed(2) || '0.00'}
      </p>
      <p className="text-gray-400 text-center text-xs mb-4">Available Balance</p>
      
      {user && (
        <div className="border-t border-gray-700 pt-3 mt-2">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <ArrowUp size={14} className="text-green-400 mr-1" />
              <p className="text-gray-400 text-sm">Total Deposits</p>
            </div>
            <p className="text-green-400 font-medium">₹{user.totalDeposit.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ArrowDown size={14} className="text-red-400 mr-1" />
              <p className="text-gray-400 text-sm">Total Withdrawals</p>
            </div>
            <p className="text-red-400 font-medium">₹{user.totalWithdraw.toFixed(2)}</p>
          </div>
        </div>
      )}
      
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => navigate('/deposit')}
          className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-md py-2 text-sm flex items-center justify-center"
        >
          <ArrowUp size={14} className="mr-1" />
          Deposit
        </button>
        <button
          onClick={() => navigate('/withdraw')}
          className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md py-2 text-sm flex items-center justify-center"
        >
          <ArrowDown size={14} className="mr-1" />
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default CurrentBalanceDisplay;
