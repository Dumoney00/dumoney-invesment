
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface InviteCardProps {
  isAuthenticated: boolean;
  userId?: string;
}

const InviteCard: React.FC<InviteCardProps> = ({ isAuthenticated, userId }) => {
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState(false);
  
  const handleCopyInvite = () => {
    if (isAuthenticated && userId) {
      navigator.clipboard.writeText(userId).then(() => {
        setCopySuccess(true);
        toast({
          title: "Copied!",
          description: "Invitation code copied to clipboard"
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
      navigate('/auth');
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg text-white font-medium mb-1">Invite friends to earn money</h3>
          <p className="text-gray-400 text-sm">The more invites, the more rewards you get!</p>
        </div>
        <Button className="bg-investment-gold hover:bg-investment-gold/90" onClick={handleCopyInvite}>
          {copySuccess ? "Copied!" : "Invite Now"}
        </Button>
      </div>
    </div>
  );
};

export default InviteCard;
