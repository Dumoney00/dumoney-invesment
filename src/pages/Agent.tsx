
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Copy, Lock, Users, BadgeDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Agent: React.FC = () => {
  const {
    user,
    isAuthenticated
  } = useAuth();
  const [copySuccess, setCopySuccess] = useState(false);

  // Mock data for team stats - in a real app this would come from backend
  const teamStats = {
    totalPeople: 0, // Would be fetched from API in real implementation
    teamInvestment: 0, // Would be fetched from API in real implementation
  };

  // Commission plans data structure
  const commissionPlans = [
    {
      level: 1,
      requiredMembers: 10,
      reward: 800,
      unlocked: true,
      icon: "🔓"
    },
    {
      level: 2,
      requiredMembers: 25,
      reward: 2000,
      unlocked: teamStats.totalPeople >= 10,
      icon: teamStats.totalPeople >= 10 ? "🔓" : "🔒"
    },
    {
      level: 3,
      requiredMembers: 50,
      reward: 5000,
      unlocked: teamStats.totalPeople >= 25,
      icon: teamStats.totalPeople >= 25 ? "🔓" : "🔒"
    },
    {
      level: 4,
      requiredMembers: 250,
      reward: 15000,
      unlocked: teamStats.totalPeople >= 50,
      icon: teamStats.totalPeople >= 50 ? "🔓" : "🔒"
    },
    {
      level: 5,
      requiredMembers: 500,
      reward: 25000,
      unlocked: teamStats.totalPeople >= 250,
      icon: teamStats.totalPeople >= 250 ? "🔓" : "🔒"
    },
    {
      level: 6,
      requiredMembers: 1000,
      reward: 75000,
      unlocked: teamStats.totalPeople >= 500,
      icon: teamStats.totalPeople >= 500 ? "🔓" : "🔒"
    },
    {
      level: 7,
      requiredMembers: 2500,
      reward: 300000,
      monthlySalary: 30000,
      unlocked: teamStats.totalPeople >= 1000,
      icon: teamStats.totalPeople >= 1000 ? "🔓" : "🔒"
    }
  ];

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
            <p className="text-white text-3xl font-bold mb-1">{teamStats.totalPeople}</p>
            <p className="text-white">Total people</p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-4">
            <p className="text-white font-bold mb-1 text-xl">{teamStats.teamInvestment.toFixed(2)}</p>
            <p className="text-white">Team investment</p>
          </div>
        </div>
        
        {/* Commission Plans Section */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-0 w-16 border-t border-gray-700"></div>
            <h2 className="text-white text-lg font-medium">Commission Plans</h2>
            <div className="h-0 w-16 border-t border-gray-700"></div>
          </div>
          
          {/* Commission Plans */}
          <div className="space-y-4">
            {commissionPlans.map((plan, index) => (
              <div key={index} className={`rounded-lg overflow-hidden ${plan.unlocked ? 'bg-[#222222]' : 'bg-[#1a1a1a]'}`}>
                <div className="px-4 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{plan.icon}</span>
                    <h3 className="text-white text-lg font-medium">
                      Plan {plan.level} {!plan.unlocked && '(Locked)'}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} className="text-white" />
                    <span className="text-white text-sm">{plan.requiredMembers} members</span>
                  </div>
                </div>
                
                <div className={`p-4 ${!plan.unlocked && 'opacity-70'}`}>
                  <div className="flex justify-between mb-3">
                    <div>
                      <h4 className="text-gray-400 text-xs mb-1">Reward</h4>
                      <p className="text-investment-gold text-xl font-bold">₹{plan.reward.toLocaleString()}</p>
                    </div>
                    
                    {plan.monthlySalary && (
                      <div>
                        <h4 className="text-gray-400 text-xs mb-1">Monthly Salary</h4>
                        <p className="text-investment-gold text-xl font-bold">₹{plan.monthlySalary.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                  
                  {!plan.unlocked && (
                    <div className="flex items-center bg-gray-800 p-2 rounded-md">
                      <Lock size={16} className="text-gray-500 mr-2" />
                      <p className="text-gray-400 text-sm">
                        Unlock by reaching {plan.requiredMembers} team members
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
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
            <h3 className="font-bold">Invite friends to earn rewards</h3>
            <p className="text-xs">Build your team and unlock higher commission plans!</p>
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
