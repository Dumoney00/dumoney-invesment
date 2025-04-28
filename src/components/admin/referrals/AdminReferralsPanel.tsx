
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ReferralStatus, UserReferralStats, ReferralRecord } from '@/types/referrals';
import { referralTiers } from '@/config/referralTiers';
import ReferralDashboardStats from './ReferralDashboardStats';
import AgentsTable from './AgentsTable';
import ReferralsTable from './ReferralsTable';

const AdminReferralsPanel: React.FC = () => {
  const { user, approveReferralBonus } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('agents');
  const [userStats, setUserStats] = useState<UserReferralStats[]>([]);
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ReferralStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<ReferralRecord | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedReferrals, setSelectedReferrals] = useState<string[]>([]);

  useEffect(() => {
    setUserStats(generateMockUserReferralStats());
    setReferrals(generateMockReferrals());
  }, []);

  const filteredReferrals = referrals.filter(referral => {
    const searchMatch = 
      referral.referrerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.referredName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === 'all' || referral.status === statusFilter;
    
    let dateMatch = true;
    if (dateFilter !== 'all') {
      const createdDate = new Date(referral.dateCreated);
      const now = new Date();
      
      if (dateFilter === 'today') {
        dateMatch = createdDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        dateMatch = createdDate >= oneWeekAgo;
      } else if (dateFilter === 'month') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        dateMatch = createdDate >= oneMonthAgo;
      }
    }
    
    return searchMatch && statusMatch && dateMatch;
  });

  const filteredUserStats = userStats.filter(stat => 
    stat.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stat.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproveReferral = async (referralId: string) => {
    if (!user?.isAdmin) return;
    
    setLoading(true);
    try {
      const referral = referrals.find(r => r.id === referralId);
      if (!referral) return;
      
      const success = await approveReferral(
        referralId,
        user.id,
        user.username,
        undefined
      );
      
      if (success) {
        setReferrals(prev => prev.map(r => {
          if (r.id === referralId) {
            return {
              ...r,
              status: 'approved' as ReferralStatus,
              dateUpdated: new Date().toISOString(),
              adminId: user.id,
              adminName: user.username
            };
          }
          return r;
        }));
        
        updateUserStatsAfterApproval(referral.referrerId);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRejectReferral = async () => {
    if (!user?.isAdmin || !selectedReferral) return;
    
    setLoading(true);
    try {
      const success = await rejectReferral(
        selectedReferral.id,
        user.id,
        user.username,
        rejectReason
      );
      
      if (success) {
        setReferrals(prev => prev.map(r => {
          if (r.id === selectedReferral.id) {
            return {
              ...r,
              status: 'rejected' as ReferralStatus,
              dateUpdated: new Date().toISOString(),
              adminId: user.id,
              adminName: user.username,
              adminComment: rejectReason
            };
          }
          return r;
        }));
      }
    } finally {
      setLoading(false);
      setRejectDialogOpen(false);
      setSelectedReferral(null);
      setRejectReason('');
    }
  };

  const openRejectDialog = (referral: ReferralRecord) => {
    setSelectedReferral(referral);
    setRejectDialogOpen(true);
  };

  const handleBulkApprove = async () => {
    if (!user?.isAdmin || selectedReferrals.length === 0) return;
    
    setLoading(true);
    try {
      const success = await bulkApproveReferrals(
        selectedReferrals,
        user.id,
        user.username
      );
      
      if (success) {
        setReferrals(prev => prev.map(r => {
          if (selectedReferrals.includes(r.id) && r.status === 'pending') {
            const referrerId = r.referrerId;
            
            const updated = {
              ...r,
              status: 'approved' as ReferralStatus,
              dateUpdated: new Date().toISOString(),
              adminId: user.id,
              adminName: user.username
            };
            
            updateUserStatsAfterApproval(referrerId);
            
            return updated;
          }
          return r;
        }));
        
        setSelectedReferrals([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatsAfterApproval = (referrerId: string) => {
    setUserStats(prev => prev.map(stat => {
      if (stat.userId === referrerId) {
        const updatedApproved = stat.approvedReferrals + 1;
        const updatedPending = stat.pendingReferrals - 1;
        
        const appropriateTier = referralTiers.find(tier => 
          updatedApproved >= tier.minReferrals && 
          (tier.maxReferrals === null || updatedApproved <= tier.maxReferrals)
        ) || referralTiers[0];
        
        return {
          ...stat,
          approvedReferrals: updatedApproved,
          pendingReferrals: updatedPending,
          level: appropriateTier.level,
        };
      }
      return stat;
    }));
  };

  const toggleReferralSelection = (referralId: string) => {
    setSelectedReferrals(prev => {
      if (prev.includes(referralId)) {
        return prev.filter(id => id !== referralId);
      } else {
        return [...prev, referralId];
      }
    });
  };

  const totalAgents = userStats.length;
  const totalReferred = userStats.reduce((sum, r) => sum + r.totalReferrals, 0);
  const totalActiveReferrals = userStats.reduce((sum, r) => sum + r.approvedReferrals, 0);
  const totalPendingBonus = userStats.reduce((sum, r) => sum + r.pendingBonus, 0);
  const totalBonusPaid = userStats.reduce((sum, r) => sum + r.totalBonus, 0);
  const pendingReferralCount = referrals.filter(r => r.status === 'pending').length;
  const overdueReferralCount = referrals.filter(r => 
    r.status === 'pending' && isReferralOverdue(r.dateCreated)
  ).length;

  return (
    <div className="space-y-6">
      <ReferralDashboardStats 
        userStats={userStats} 
        referrals={referrals}
        isReferralOverdue={isReferralOverdue}
      />

      <Card className="bg-[#222B45]/80 border-[#33374D]">
        <CardHeader className="pb-3">
          <CardTitle className="text-white">Referral Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 bg-[#1A1F2C]/80 mb-6 p-1 rounded-lg">
              <TabsTrigger 
                value="agents" 
                className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
              >
                Agents
              </TabsTrigger>
              <TabsTrigger 
                value="referrals" 
                className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
              >
                Referral History
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="relative w-full md:w-64">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-[#1A1F2C] border-[#33374D] text-white pl-10"
                />
              </div>
              
              {activeTab === 'referrals' && (
                <>
                  <div className="flex-1 flex items-center gap-2">
                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReferralStatus | 'all')}>
                      <SelectTrigger className="bg-[#1A1F2C] border-[#33374D] text-white w-[140px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1F2C] border-[#33374D] text-white">
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as 'all' | 'today' | 'week' | 'month')}>
                      <SelectTrigger className="bg-[#1A1F2C] border-[#33374D] text-white w-[140px]">
                        <SelectValue placeholder="Filter by date" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1F2C] border-[#33374D] text-white">
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
                    disabled={selectedReferrals.length === 0 || loading}
                    onClick={handleBulkApprove}
                  >
                    <Check size={16} className="mr-1" />
                    Bulk Approve ({selectedReferrals.length})
                  </Button>
                </>
              )}
            </div>
            
            <TabsContent value="agents" className="mt-0">
              <AgentsTable users={filteredUserStats} />
            </TabsContent>
            
            <TabsContent value="referrals" className="mt-0">
              <ReferralsTable 
                referrals={filteredReferrals}
                selectedReferrals={selectedReferrals}
                loading={loading}
                isReferralOverdue={isReferralOverdue}
                onToggleSelect={toggleReferralSelection}
                onToggleSelectAll={() => {
                  if (selectedReferrals.length > 0) {
                    setSelectedReferrals([]);
                  } else {
                    const pendingIds = filteredReferrals
                      .filter(r => r.status === 'pending')
                      .map(r => r.id);
                    setSelectedReferrals(pendingIds);
                  }
                }}
                onApprove={handleApproveReferral}
                onReject={openRejectDialog}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="bg-[#222B45] border-[#33374D] text-white">
          <DialogHeader>
            <DialogTitle>Reject Referral</DialogTitle>
            <DialogDescription className="text-gray-400">
              Please provide a reason for rejection. This will be visible to the referrer.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason for rejection..."
            className="bg-[#1A1F2C] border-[#33374D] text-white"
          />
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              className="border-[#33374D] text-gray-300 hover:bg-[#1A1F2C]"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleRejectReferral}
              disabled={!rejectReason.trim() || loading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <X size={16} className="mr-1" />
              Reject Referral
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReferralsPanel;
