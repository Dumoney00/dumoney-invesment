import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReferralStatus } from '@/types/referrals';
import { isReferralOverdue } from '@/services/referralService';
import { ReferralRejectDialog } from './ReferralRejectDialog';
import ReferralTabManager from './ReferralTabManager';
import { useReferralStats } from '@/hooks/useReferralStats';
import { useReferralManagement } from '@/hooks/useReferralManagement';
import { generateMockReferrals } from '@/services/referralService';

const AdminReferralsPanel: React.FC = () => {
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
        <CardHeader className="pb-3">
          <CardTitle className="text-white">Referral Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ReferralTabManager
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userStats={userStats}
            filteredReferrals={filteredReferrals}
            filteredUserStats={filteredUserStats}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            selectedReferrals={selectedReferrals}
            loading={loading}
            onBulkApprove={handleBulkApprove}
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

export default AdminReferralsPanel;
