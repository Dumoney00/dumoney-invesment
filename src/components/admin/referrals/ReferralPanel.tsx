
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ReferralStatus } from '@/types/referrals';
import { isReferralOverdue } from '@/services/referralService';
import { ReferralRejectDialog } from './ReferralRejectDialog';
import ReferralDashboardStats from './ReferralDashboardStats';
import { useReferralStats } from '@/hooks/useReferralStats';
import { useReferralManagement } from '@/hooks/useReferralManagement';
import { generateMockReferrals } from '@/services/referralService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReferralsTable from './ReferralsTable';
import AgentsTable from './AgentsTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { CheckCircle, Filter } from 'lucide-react';

const ReferralPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('agents');
  const [statusFilter, setStatusFilter] = useState<ReferralStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  
  const { userStats } = useReferralStats();
  const {
    loading,
    selectedReferrals,
    setSelectedReferrals,
    selectedReferral,
    setSelectedReferral,
    rejectDialogOpen,
    setRejectDialogOpen,
    handleApproveReferral,
    handleBulkApprove,
    handleReject
  } = useReferralManagement();

  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
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

  return (
    <div className="space-y-6">
      <ReferralDashboardStats 
        userStats={userStats} 
        referrals={filteredReferrals}
        isReferralOverdue={isReferralOverdue}
      />

      <Card className="bg-[#222B45]/80 border-[#33374D]">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
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
            
            {/* Filters */}
            <div className="mb-6 flex flex-col md:flex-row gap-3">
              <Input
                placeholder={`Search ${activeTab === 'agents' ? 'agents' : 'referrals'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#1A1F2C]/50 border-[#33374D] text-white flex-1"
              />
              
              {activeTab === 'referrals' && (
                <>
                  <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                    <SelectTrigger className="bg-[#1A1F2C]/50 border-[#33374D] text-white w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1F2C] border-[#33374D] text-white">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
                    <SelectTrigger className="bg-[#1A1F2C]/50 border-[#33374D] text-white w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1F2C] border-[#33374D] text-white">
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {selectedReferrals.length > 0 && (
                    <Button 
                      onClick={handleBulkApprove}
                      disabled={loading || selectedReferrals.length === 0}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve ({selectedReferrals.length})
                    </Button>
                  )}
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
        onReject={handleReject}
      />
    </div>
  );
};

export default ReferralPanel;
