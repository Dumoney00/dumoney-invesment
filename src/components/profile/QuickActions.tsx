
import React from 'react';
import { Settings, User, MessageCircle, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div 
        className="flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => navigate('/account')}
      >
        <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
          <User size={20} className="text-white" />
        </div>
        <span className="text-white text-xs">Account</span>
      </div>
      
      <div 
        className="flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => navigate('/change-password')}
      >
        <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
          <Settings size={20} className="text-white" />
        </div>
        <span className="text-white text-xs">Settings</span>
      </div>
      
      <div 
        className="flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => navigate('/guide')}
      >
        <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
          <HelpCircle size={20} className="text-white" />
        </div>
        <span className="text-white text-xs">Guide</span>
      </div>
      
      <div 
        className="flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => navigate('/account')}
      >
        <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
          <MessageCircle size={20} className="text-white" />
        </div>
        <span className="text-white text-xs">Support</span>
      </div>
    </div>
  );
};

export default QuickActions;
