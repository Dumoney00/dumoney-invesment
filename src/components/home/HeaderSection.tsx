
import React from 'react';
import { Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";

const HeaderSection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <>
      <header className="bg-[#333333] py-4 relative">
        <h1 className="text-xl text-center font-bold text-yellow-500">DUMONEY INVEST</h1>
        
        {user && (
          <div 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer flex items-center"
            onClick={() => navigate('/deposit')}
          >
            <Wallet size={20} className="text-investment-gold mr-1" />
            <span className="text-investment-gold text-sm">₹{user.balance.toLocaleString()}</span>
          </div>
        )}
      </header>
      <div className="bg-investment-yellow h-2"></div>
    </>
  );
};

export default HeaderSection;
