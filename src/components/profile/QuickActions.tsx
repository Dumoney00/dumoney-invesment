
import React from 'react';
import { Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div 
        className="flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => navigate('/change-password')}
      >
        <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
          <Settings size={20} className="text-white" />
        </div>
        <span className="text-white text-xs">Password</span>
      </div>
      
      <div 
        className="flex flex-col items-center gap-2 cursor-pointer"
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
