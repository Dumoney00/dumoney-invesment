
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const InvitationSection: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [copySuccess, setCopySuccess] = useState(false);

  const generateInviteCode = () => {
    if (isAuthenticated && user) {
      return user.id.substring(0, 8);
    }
    return '';
  };

  const handleCopyInvite = () => {
    if (isAuthenticated && user) {
      const inviteCode = generateInviteCode();
      const inviteLink = `https://energy-investment.site/register?ref=${inviteCode}`;
      
      navigator.clipboard.writeText(inviteLink).then(() => {
        setCopySuccess(true);
        toast({
          title: "Copied!",
          description: "Invitation link copied to clipboard"
        });
        setTimeout(() => setCopySuccess(false), 2000);
      }).catch(err => {
        toast({
          title: "Failed to copy",
          description: "Please try again",
          variant: "destructive"
        });
      });
    } else {
      toast({
        title: "Login Required",
        description: "Please login to copy your invitation code",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-[#222222] rounded-lg p-6 text-center">
      <h3 className="text-yellow-500 text-2xl font-bold mb-2">
        {generateInviteCode() || '...'}
      </h3>
      <p className="text-gray-400 mb-4 text-sm break-words">
        {isAuthenticated 
          ? `https://energy-investment.site/register?ref=${generateInviteCode()}` 
          : 'Please login to view your invitation link'
        }
      </p>
      <Button 
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-8" 
        onClick={handleCopyInvite}
        disabled={!isAuthenticated}
      >
        {copySuccess ? "Copied!" : "Copy"}
      </Button>
    </div>
  );
};

export default InvitationSection;
