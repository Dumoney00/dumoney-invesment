
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PartnerBanner: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6">
      <div className="bg-gradient-to-r from-investment-gold to-yellow-500 rounded-lg p-4 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-white text-xl font-bold mb-1">Become a partner and receive</h3>
          <p className="text-white text-xl font-bold">daily salary rewards</p>
          <Button 
            className="mt-2 bg-white text-investment-gold hover:bg-white/90"
            onClick={() => navigate('/agent')}
          >
            Click to enter
          </Button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute right-0 bottom-0 h-20 w-20 bg-yellow-300 rounded-full opacity-20"></div>
        <div className="absolute right-8 top-0 h-12 w-12 bg-yellow-300 rounded-full opacity-20"></div>
        <div className="absolute left-4 bottom-0 h-16 w-16 bg-green-300 rounded-full opacity-20"></div>
      </div>
    </div>
  );
};

export default PartnerBanner;
