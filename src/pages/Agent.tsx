import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
const Agent: React.FC = () => {
  const {
    user,
    isAuthenticated
  } = useAuth();
  const [copySuccess, setCopySuccess] = useState(false);

  // Copy invitation code
  const handleCopyInvite = () => {
    if (isAuthenticated && user) {
      const inviteCode = user.id;
      const inviteLink = `https://energy-investment.site/register?inviteCode=${inviteCode}`;
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
  return <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="bg-[#333333] py-4">
        <h1 className="text-white text-xl text-center font-medium">Agent</h1>
      </header>
      
      {/* Yellow Banner */}
      <div className="bg-investment-yellow h-2"></div>
      
      <div className="p-4">
        {/* Team Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-4">
            <p className="text-white text-3xl font-bold mb-1">0</p>
            <p className="text-white">Total people</p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-4">
            <p className="text-white font-bold mb-1 text-xl">0.00</p>
            <p className="text-white">Team investment</p>
          </div>
        </div>
        
        {/* Team Info Section */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-0 w-16 border-t border-gray-700"></div>
            <h2 className="text-white text-lg font-medium">Team info</h2>
            <div className="h-0 w-16 border-t border-gray-700"></div>
          </div>
          
          {/* Level 1 Team */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-yellow-500 text-2xl">🏆</div>
                <h3 className="text-white text-lg">My first-level team</h3>
              </div>
              <div className="text-yellow-500 font-medium">Commission 20%</div>
            </div>
            
            <div className="bg-[#222222] rounded-lg grid grid-cols-3 p-4">
              <div className="text-center">
                <p className="text-investment-gold text-2xl font-bold">0.00</p>
                <p className="text-gray-400 text-xs">Team commission</p>
              </div>
              <div className="text-center">
                <p className="text-white text-2xl font-bold">0</p>
                <p className="text-gray-400 text-xs">Team people</p>
              </div>
              <div className="text-center">
                <p className="text-investment-gold text-2xl font-bold">0.00</p>
                <p className="text-gray-400 text-xs">Team invest(20%)</p>
              </div>
            </div>
          </div>
          
          {/* Level 2 Team */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-blue-500 text-2xl">🥈</div>
                <h3 className="text-white text-lg">My second-level team</h3>
              </div>
              <div className="text-yellow-500 font-medium">Commission 15%</div>
            </div>
            
            <div className="bg-[#222222] rounded-lg grid grid-cols-3 p-4">
              <div className="text-center">
                <p className="text-investment-gold text-2xl font-bold">0.00</p>
                <p className="text-gray-400 text-xs">Team commission</p>
              </div>
              <div className="text-center">
                <p className="text-white text-2xl font-bold">0</p>
                <p className="text-gray-400 text-xs">Team people</p>
              </div>
              <div className="text-center">
                <p className="text-investment-gold text-2xl font-bold">0.00</p>
                <p className="text-gray-400 text-xs">Team Invest(15%)</p>
              </div>
            </div>
          </div>
          
          {/* Level 3 Team */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-orange-500 text-2xl">🥉</div>
                <h3 className="text-white text-lg">My three-level team</h3>
              </div>
              <div className="text-yellow-500 font-medium">Commission 10%</div>
            </div>
            
            <div className="bg-[#222222] rounded-lg grid grid-cols-3 p-4">
              <div className="text-center">
                <p className="text-investment-gold text-2xl font-bold">0.00</p>
                <p className="text-gray-400 text-xs">Team commission</p>
              </div>
              <div className="text-center">
                <p className="text-white text-2xl font-bold">0</p>
                <p className="text-gray-400 text-xs">Team people</p>
              </div>
              <div className="text-center">
                <p className="text-investment-gold text-2xl font-bold">0.00</p>
                <p className="text-gray-400 text-xs">Team Invest(10%)</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Invitation Method */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-0 w-16 border-t border-gray-700"></div>
            <h2 className="text-white text-lg font-medium">Invitation method</h2>
            <div className="h-0 w-16 border-t border-gray-700"></div>
          </div>
          
          <div className="bg-[#222222] rounded-lg p-6 text-center">
            <h3 className="text-yellow-500 text-2xl font-bold mb-2">
              {user?.id.substring(0, 8) || '...'}
            </h3>
            <p className="text-gray-400 mb-4 text-sm break-words">
              {isAuthenticated ? `https://energy-investment.site/register?inviteCode=${user?.id}` : 'Please login to view your invitation link'}
            </p>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8" onClick={handleCopyInvite} disabled={!isAuthenticated}>
              {copySuccess ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
        
        {/* Invitation Banner */}
        <div className="bg-gray-100 rounded-lg p-4 flex items-center">
          <div className="flex-1 text-black mr-4">
            <h3 className="font-bold">Invite friends to earn money</h3>
            <p className="text-xs">The more invites, the more rewards you get!</p>
          </div>
          <Button className="bg-investment-gold hover:bg-investment-gold/90" onClick={handleCopyInvite} disabled={!isAuthenticated}>
            <Copy className="mr-2" size={16} />
            Share
          </Button>
        </div>
      </div>
      
      <Navigation />
      <FloatingActionButton />
    </div>;
};
export default Agent;