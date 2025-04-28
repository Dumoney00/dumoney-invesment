
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateReferralCode } from '@/services/referralService';

interface ReferralCodeProps {
  isAuthenticated: boolean;
  userId: string;
}

const ReferralCode: React.FC<ReferralCodeProps> = ({ isAuthenticated, userId }) => {
  const handleCopyCode = () => {
    if (!isAuthenticated) return;
    
    const referralCode = generateReferralCode(userId);
    navigator.clipboard.writeText(referralCode).then(() => {
      toast({
        title: "Copied!",
        description: "Your permanent referral code has been copied to clipboard"
      });
    }).catch(err => {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive"
      });
    });
  };

  return (
    <div className="bg-[#222222] rounded-lg p-6 text-center mb-6">
      <h3 className="text-yellow-500 text-2xl font-bold mb-2">
        {isAuthenticated ? generateReferralCode(userId) : '...'}
      </h3>
      <p className="text-gray-400 mb-4 text-sm">
        This is your permanent referral code. Share it with unlimited friends to earn rewards!
      </p>
      <Button 
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-8" 
        onClick={handleCopyCode} 
        disabled={!isAuthenticated}
      >
        <Copy className="mr-2" size={16} />
        Copy Code
      </Button>
    </div>
  );
};

export default ReferralCode;
