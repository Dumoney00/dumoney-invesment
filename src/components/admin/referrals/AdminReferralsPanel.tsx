
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReferralStatus, UserReferralStats, ReferralRecord } from '@/types/referrals';
import { referralTiers } from '@/config/referralTiers';
import { 
  generateMockReferrals,
  generateMockUserReferralStats,
  approveReferral,
  rejectReferral,
  bulkApproveReferrals,
  isReferralOverdue
} from '@/services/referralService';
import ReferralDashboardStats from './ReferralDashboardStats';
import AgentsTable from './AgentsTable';
import ReferralsTable from './ReferralsTable';
import { ReferralFilters } from './ReferralFilters';
import { ReferralRejectDialog } from './ReferralRejectDialog';

const AdminReferralsPanel: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('agents');
  const [userStats, setUserStats] = useState<UserReferralStats[]>([]);
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ReferralStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<ReferralRecord | null>(null);
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

            <ReferralFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeTab={activeTab}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              selectedReferrals={selectedReferrals}
              loading={loading}
              onBulkApprove={handleBulkApprove}
            />
            
            <TabsContent value="agents" className="mt-0">
              <AgentsTable users={filteredUserStats} />
            </TabsContent>
            
            <TabsContent value="referrals" className="mt-0">
              <ReferralsTable 
                referrals={filteredReferrals}
                selectedReferrals={selectedReferrals}
                loading={loading}
                isReferralOverdue={isReferralOverdue}
                onToggleSelect={id => setSelectedReferrals(prev => 
                  prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
                )}
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
                onReject={referral => {
                  setSelectedReferral(referral);
                  setRejectDialogOpen(true);
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ReferralRejectDialog 
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        onReject={async (reason: string) => {
          if (!user?.isAdmin || !selectedReferral) return;
          
          setLoading(true);
          try {
            const success = await rejectReferral(
              selectedReferral.id,
              user.id,
              user.username,
              reason
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
                    adminComment: reason
                  };
                }
                return r;
              }));
            }
          } finally {
            setLoading(false);
            setRejectDialogOpen(false);
            setSelectedReferral(null);
          }
        }}
      />
    </div>
  );
};

export default AdminReferralsPanel;
