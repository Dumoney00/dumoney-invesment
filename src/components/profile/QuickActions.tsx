
import React from 'react';
import { Wallet, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div 
        className="flex flex-col items-center gap-2" 
        onClick={() => navigate('/deposit')}
      >
        <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
          <Wallet size={20} className="text-white" />
        </div>
        <span className="text-white text-xs">Deposit</span>
      </div>
      
      <div 
        className="flex flex-col items-center gap-2"
        onClick={() => navigate('/withdraw')}
      >
        <div className="h-12 w-12 rounded-full bg-red-500 flex items-center justify-center">
          <Wallet size={20} className="text-white" />
        </div>
        <span className="text-white text-xs">Withdraw</span>
      </div>
      
      <div 
        className="flex flex-col items-center gap-2"
        onClick={() => navigate('/change-password')}
      >
        <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
          <Settings size={20} className="text-white" />
        </div>
        <span className="text-white text-xs">Password</span>
      </div>
      
      <div 
        className="flex flex-col items-center gap-2"
        onClick={() => navigate('/account')}
      >
        <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center">
          <User size={20} className="text-white" />
        </div>
        <span className="text-white text-xs">Account</span>
      </div>
    </div>
  );
};

export default QuickActions;
