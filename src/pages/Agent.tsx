
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Copy, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Agent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [copySuccess, setCopySuccess] = useState(false);

  // Generate simple invitation code from user ID
  const generateInviteCode = () => {
    if (isAuthenticated && user) {
      return user.id.substring(0, 8);
    }
    return '';
  };

  // Copy invitation code
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
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="bg-[#333333] py-4">
        <h1 className="text-white text-xl text-center font-medium">Agent Center</h1>
      </header>
      
      {/* Yellow Banner */}
      <div className="bg-investment-yellow h-2"></div>
      
      <div className="p-4">
        {/* Simple Stats Card */}
        <div className="mb-6">
          <Card className="bg-[#222222] border-gray-700">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#333333] rounded-lg p-4 flex flex-col items-center">
                  <Users size={20} className="text-blue-400 mb-2" />
                  <p className="text-xl font-bold text-white">0</p>
                  <p className="text-xs text-gray-400">Total Referrals</p>
                </div>
                
                <div className="bg-[#333333] rounded-lg p-4 flex flex-col items-center">
                  <TrendingUp size={20} className="text-purple-400 mb-2" />
                  <p className="text-xl font-bold text-white">₹0</p>
                  <p className="text-xs text-gray-400">Total Earned</p>
                </div>
              </div>
              
              <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
                5% Bonus Rate
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Invitation Method */}
        <div className="mb-6">
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
        </div>
        
        {/* Invitation Banner */}
        <div className="bg-gray-100 rounded-lg p-4 flex items-center">
          <div className="flex-1 text-black mr-4">
            <h3 className="font-bold">Invite friends to earn rewards</h3>
            <p className="text-xs">Share your invitation code and earn bonuses!</p>
          </div>
          <Button 
            className="bg-investment-gold hover:bg-investment-gold/90" 
            onClick={handleCopyInvite}
            disabled={!isAuthenticated}
          >
            <Copy className="mr-2" size={16} />
            Share
          </Button>
        </div>
      </div>
      
      <Navigation />
      <FloatingActionButton />
    </div>
  );
};

export default Agent;
