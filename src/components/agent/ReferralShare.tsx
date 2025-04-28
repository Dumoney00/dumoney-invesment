
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Share2 } from 'lucide-react';
import { showToast } from '@/utils/toastUtils';

interface ReferralShareProps {
  onCopyCode: () => void;
  isAuthenticated: boolean;
}

const ReferralShare: React.FC<ReferralShareProps> = ({ onCopyCode, isAuthenticated }) => {
  const handleShare = async () => {
    if (!isAuthenticated) {
      showToast("Error", "Please login to share your referral code", "destructive");
      return;
    }
    
    // Try native share API first if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Investment Platform',
          text: 'Use my referral code to sign up and earn bonus rewards!',
          url: window.location.origin + '/auth?ref=true',
        });
        showToast("Success", "Shared successfully!");
      } catch (error) {
        // Fall back to copy method if share fails or is cancelled
        onCopyCode();
      }
    } else {
      // If share API not available, just copy the code
      onCopyCode();
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-4 flex items-center shadow-md">
      <div className="flex-1 text-black mr-4">
        <h3 className="font-bold text-lg">Share your referral code</h3>
        <p className="text-sm text-gray-600">Help friends join and earn great rewards!</p>
      </div>
      <Button 
        className="bg-investment-gold hover:bg-investment-gold/90 text-black font-medium" 
        onClick={handleShare} 
        disabled={!isAuthenticated}
      >
        <Share2 className="mr-2" size={16} />
        Share
      </Button>
    </div>
  );
};

export default ReferralShare;
