
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface ReferralShareProps {
  onCopyCode: () => void;
  isAuthenticated: boolean;
}

const ReferralShare: React.FC<ReferralShareProps> = ({ onCopyCode, isAuthenticated }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4 flex items-center">
      <div className="flex-1 text-black mr-4">
        <h3 className="font-bold">Share your referral code</h3>
        <p className="text-xs">Help friends join and earn great rewards!</p>
      </div>
      <Button 
        className="bg-investment-gold hover:bg-investment-gold/90" 
        onClick={onCopyCode} 
        disabled={!isAuthenticated}
      >
        <Copy className="mr-2" size={16} />
        Share
      </Button>
    </div>
  );
};

export default ReferralShare;
