import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Copy, Users, BadgeDollarSign, Lock, UserCheck, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

import { 
  referralTiers, 
  getUserReferralTier, 
  generateReferralCode,
  generateMockReferrals
} from '@/services/referralService';
import { TeamMember, TeamStats } from '@/types/team';
import { ReferralRecord } from '@/types/referrals';

const Agent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('team');
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      setReferrals(generateMockReferrals());
    }
  }, [isAuthenticated]);

  const teamMembers: TeamMember[] = [];

  const userReferrals = referrals.filter(r => 
    isAuthenticated && user && r.referrerId === user.id
  );

  const formatDate = (isoDate: string): string => {
    return new Date(isoDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const teamStats: TeamStats = {
    totalPeople: teamMembers.length,
    activePeople: teamMembers.filter(member => member.hasPurchased).length,
    teamInvestment: 0,
  };

  const userTier = isAuthenticated && user 
    ? getUserReferralTier(userReferrals.filter(r => r.status === 'approved').length)
    : referralTiers[0];

  const approvedCount = userReferrals.filter(r => r.status === 'approved').length;
  const pendingCount = userReferrals.filter(r => r.status === 'pending').length;
  const rejectedCount = userReferrals.filter(r => r.status === 'rejected').length;
  const totalCount = userReferrals.length;

  const pendingBonus = userReferrals
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + r.bonusAmount, 0);
    
  const earnedBonus = userReferrals
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.bonusAmount, 0);

  const handleCopyCode = () => {
    if (isAuthenticated && user) {
      const referralCode = generateReferralCode(user.id);
      
      navigator.clipboard.writeText(referralCode).then(() => {
        setCopySuccess(true);
        toast({
          title: "Copied!",
          description: "Your 5-digit referral code has been copied to clipboard"
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
        description: "Please login to get your referral code",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      <header className="bg-[#333333] py-4">
        <h1 className="text-white text-xl text-center font-medium">Agent Center</h1>
      </header>
      
      <div className="bg-investment-yellow h-2"></div>
      
      <div className="p-4">
        <div className="mb-6">
          <Card className="bg-[#222222] border-gray-700 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-investment-gold to-yellow-500"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Badge className={`mr-2 ${userTier.color}`}>
                    {userTier.name}
                  </Badge> 
                  Agent Status
                </h2>
                <Badge variant="outline" className="bg-[#333333] text-gray-300 border-gray-700">
                  {userTier.bonusPercentage}% Bonus Rate
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-[#333333] rounded-lg p-4 flex flex-col items-center">
                  <Users size={20} className="text-blue-400 mb-2" />
                  <p className="text-xl font-bold text-white">{totalCount}</p>
                  <p className="text-xs text-gray-400">Total Referrals</p>
                </div>
                
                <div className="bg-[#333333] rounded-lg p-4 flex flex-col items-center">
                  <UserCheck size={20} className="text-green-400 mb-2" />
                  <p className="text-xl font-bold text-white">{approvedCount}</p>
                  <p className="text-xs text-gray-400">Approved</p>
                </div>
                
                <div className="bg-[#333333] rounded-lg p-4 flex flex-col items-center">
                  <Clock size={20} className="text-amber-400 mb-2" />
                  <p className="text-xl font-bold text-white">{pendingCount}</p>
                  <p className="text-xs text-gray-400">Pending</p>
                </div>
                
                <div className="bg-[#333333] rounded-lg p-4 flex flex-col items-center">
                  <TrendingUp size={20} className="text-purple-400 mb-2" />
                  <p className="text-xl font-bold text-white">₹{earnedBonus.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Total Earned</p>
                </div>
              </div>
              
              <div className="flex gap-2 mb-2">
                {userTier.benefits.map((benefit, index) => (
                  <Badge key={index} variant="outline" className="bg-[#333333] text-gray-300 border-gray-700">
                    {benefit}
                  </Badge>
                ))}
              </div>
              
              {userTier.level !== 'gold' && (
                <div className="text-sm text-gray-400 mt-2">
                  {approvedCount} / {referralTiers.find(t => t.level === 'gold')?.minReferrals} approved referrals to reach Gold
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-[#222222] border-gray-700 mb-6">
          <CardContent className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 bg-[#333333] mb-4 p-1 rounded-lg">
                <TabsTrigger 
                  value="team" 
                  className="data-[state=active]:bg-investment-gold data-[state=active]:text-black"
                >
                  My Team
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="data-[state=active]:bg-investment-gold data-[state=active]:text-black"
                >
                  Referral History
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="team" className="mt-0">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-4">
                    <p className="text-white text-3xl font-bold mb-1">
                      {teamStats.activePeople}/{teamStats.totalPeople}
                    </p>
                    <p className="text-white">Active Members</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-4">
                    <p className="text-white font-bold mb-1 text-xl">
                      ₹{teamStats.teamInvestment.toFixed(2)}
                    </p>
                    <p className="text-white">Team investment</p>
                  </div>
                </div>
                
                {teamMembers.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Users size={48} className="mx-auto opacity-20 mb-3" />
                    <p>No team members yet</p>
                    <p className="text-sm">Share your referral link to grow your team</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Team members would be rendered here */}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="history" className="mt-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-[#333333]">
                      <TableRow className="border-gray-700 hover:bg-[#2a2a2a]">
                        <TableHead className="text-gray-400">User</TableHead>
                        <TableHead className="text-gray-400">Date</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                        <TableHead className="text-gray-400 text-right">Bonus</TableHead>
                        <TableHead className="text-gray-400">Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userReferrals.length > 0 ? (
                        userReferrals.map(referral => (
                          <TableRow key={referral.id} className="border-gray-700 hover:bg-[#2a2a2a]">
                            <TableCell className="text-gray-300">{referral.referredName}</TableCell>
                            <TableCell className="text-gray-300">{formatDate(referral.dateCreated)}</TableCell>
                            <TableCell>
                              {referral.status === 'pending' && (
                                <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                  Pending
                                </Badge>
                              )}
                              {referral.status === 'approved' && (
                                <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                                  Approved
                                </Badge>
                              )}
                              {referral.status === 'rejected' && (
                                <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
                                  Rejected
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right text-gray-300">
                              ₹{referral.bonusAmount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-gray-300">{referral.adminComment || '-'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow className="border-gray-700">
                          <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                            No referral history found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-0 w-16 border-t border-gray-700"></div>
            <h2 className="text-white text-lg font-medium">Commission Plans</h2>
            <div className="h-0 w-16 border-t border-gray-700"></div>
          </div>
          
          <div className="space-y-4">
            {referralTiers.map((tier, index) => {
              const isCurrentTier = userTier.level === tier.level;
              const isUnlocked = isAuthenticated && isCurrentTier || 
                (referralTiers.findIndex(t => t.level === userTier.level) >= 
                referralTiers.findIndex(t => t.level === tier.level));
              
              return (
                <div key={index} className={`rounded-lg overflow-hidden ${isUnlocked ? 'bg-[#222222]' : 'bg-[#1a1a1a]'}`}>
                  <div className={`px-4 py-3 ${
                    tier.level === 'bronze' ? 'bg-gradient-to-r from-amber-700 to-amber-500' :
                    tier.level === 'silver' ? 'bg-gradient-to-r from-gray-600 to-gray-400' :
                    'bg-gradient-to-r from-yellow-600 to-yellow-400'
                  } flex justify-between items-center`}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {isUnlocked ? '🔓' : '🔒'}
                      </span>
                      <h3 className="text-white text-lg font-medium">
                        {tier.name} {!isUnlocked && '(Locked)'}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} className="text-white" />
                      <span className="text-white text-sm">
                        {tier.minReferrals}+ referrals
                      </span>
                    </div>
                  </div>
                  
                  <div className={`p-4 ${!isUnlocked && 'opacity-70'}`}>
                    <div className="flex justify-between mb-3">
                      <div>
                        <h4 className="text-gray-400 text-xs mb-1">Bonus Rate</h4>
                        <p className="text-investment-gold text-xl font-bold">{tier.bonusPercentage}%</p>
                      </div>
                      
                      <div>
                        <h4 className="text-gray-400 text-xs mb-1">Benefits</h4>
                        <div className="flex flex-wrap gap-1">
                          {tier.benefits.map((benefit, i) => (
                            <p key={i} className="text-white text-sm">
                              {i > 0 && <span className="mx-1 text-gray-500">•</span>}
                              {benefit}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {!isUnlocked && (
                      <div className="flex items-center bg-gray-800 p-2 rounded-md">
                        <Lock size={16} className="text-gray-500 mr-2" />
                        <p className="text-gray-400 text-sm">
                          Unlock by reaching {tier.minReferrals} approved referrals
                        </p>
                      </div>
                    )}
                    
                    {isCurrentTier && (
                      <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 mt-2">
                        Current Level
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-0 w-16 border-t border-gray-700"></div>
            <h2 className="text-white text-lg font-medium">Your Referral Code</h2>
            <div className="h-0 w-16 border-t border-gray-700"></div>
          </div>
          
          <div className="bg-[#222222] rounded-lg p-6 text-center">
            <h3 className="text-yellow-500 text-2xl font-bold mb-2">
              {isAuthenticated ? generateReferralCode(user?.id || '') : '...'}
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              Share this 5-digit code with your friends to earn rewards
            </p>
            <Button 
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8" 
              onClick={handleCopyCode} 
              disabled={!isAuthenticated}
            >
              {copySuccess ? "Copied!" : "Copy Code"}
            </Button>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 flex items-center">
          <div className="flex-1 text-black mr-4">
            <h3 className="font-bold">Share your referral code</h3>
            <p className="text-xs">Help friends join and earn great rewards!</p>
          </div>
          <Button 
            className="bg-investment-gold hover:bg-investment-gold/90" 
            onClick={handleCopyCode} 
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
