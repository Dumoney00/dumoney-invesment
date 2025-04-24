
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const EmptyInvestments: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <img 
        src="/lovable-uploads/5315140b-b55c-4211-85e0-8b4d86ed8ace.png" 
        alt="No investments" 
        className="w-40 h-40 mb-4"
      />
      <p className="text-gray-400 text-center mb-6">No product data!</p>
      <Button 
        className="bg-gradient-to-r from-investment-gold to-yellow-500 text-white"
        onClick={() => navigate('/products')}
      >
        To make money &gt;&gt;
      </Button>
    </div>
  );
};

export default EmptyInvestments;
