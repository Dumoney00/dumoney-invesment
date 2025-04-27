
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface InviteBannerProps {
  onCopyInvite: () => void;
  isAuthenticated: boolean;
}

const InviteBanner: React.FC<InviteBannerProps> = ({ onCopyInvite, isAuthenticated }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4 flex items-center">
      <div className="flex-1 text-black mr-4">
        <h3 className="font-bold">Invite friends to earn rewards</h3>
        <p className="text-xs">Share your invitation code and earn bonuses!</p>
      </div>
      <Button 
        className="bg-investment-gold hover:bg-investment-gold/90" 
        onClick={onCopyInvite}
        disabled={!isAuthenticated}
      >
        <Copy className="mr-2" size={16} />
        Share
      </Button>
    </div>
  );
};

export default InviteBanner;
