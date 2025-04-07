
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ArrowDown } from 'lucide-react';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-4 gap-2 px-6 mb-6">
      <div className="flex flex-col items-center" onClick={() => navigate('/deposit')}>
        <div className="bg-gray-800 rounded-lg p-2 mb-2 w-16 h-16 flex items-center justify-center">
          <Wallet className="text-green-400 w-10 h-10" />
        </div>
        <span className="text-white text-sm">Wallet</span>
      </div>
      
      <div className="flex flex-col items-center" onClick={() => navigate('/withdraw')}>
        <div className="bg-gray-800 rounded-lg p-2 mb-2 w-16 h-16 flex items-center justify-center">
          <ArrowDown className="text-red-400 w-10 h-10" />
        </div>
        <span className="text-white text-sm">Withdraw</span>
      </div>
      
      <div className="flex flex-col items-center" onClick={() => navigate('/profile')}>
        <div className="bg-gray-800 rounded-lg p-2 mb-2 w-16 h-16 flex items-center justify-center">
          <img src="/lovable-uploads/5e66b3aa-94e1-4704-ab30-f3f9bbaec223.png" alt="Account" className="w-10 h-10" />
        </div>
        <span className="text-white text-sm">Account</span>
      </div>
      
      <div className="flex flex-col items-center" onClick={() => navigate('/guide')}>
        <div className="bg-gray-800 rounded-lg p-2 mb-2 w-16 h-16 flex items-center justify-center">
          <img src="/lovable-uploads/5315140b-b55c-4211-85e0-8b4d86ed8ace.png" alt="Guide" className="w-10 h-10" />
        </div>
        <span className="text-white text-sm">Guide</span>
      </div>
    </div>
  );
};

export default QuickActions;
