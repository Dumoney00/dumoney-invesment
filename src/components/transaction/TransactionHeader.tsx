
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TransactionHeaderProps {
  title: string;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  
  return (
    <>
      <header className="bg-[#333333] py-4 relative">
        <Button 
          variant="ghost" 
          className="absolute left-2 top-3 text-gray-300 hover:text-white p-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-white text-xl text-center font-medium">— {title} —</h1>
      </header>
      
      <div className="bg-investment-yellow h-2"></div>
    </>
  );
};

export default TransactionHeader;
