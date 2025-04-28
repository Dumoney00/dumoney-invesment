
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReferralDashboardStats from './ReferralDashboardStats';
import AgentsTable from './AgentsTable';
import ReferralsTable from './ReferralsTable';
import { ReferralFilters } from './ReferralFilters';
import { UserReferralStats, ReferralRecord } from '@/types/referrals';

interface ReferralTabManagerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userStats: UserReferralStats[];
  filteredReferrals: ReferralRecord[];
  filteredUserStats: UserReferralStats[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: any) => void;
  dateFilter: string;
  setDateFilter: (filter: any) => void;
  selectedReferrals: string[];
  loading: boolean;
  onBulkApprove: () => void;
  isReferralOverdue: (date: string) => boolean;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onApprove: (id: string) => void;
  onReject: (referral: ReferralRecord) => void;
}

const ReferralTabManager: React.FC<ReferralTabManagerProps> = ({
  activeTab,
  setActiveTab,
  userStats,
  filteredReferrals,
  filteredUserStats,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  selectedReferrals,
  loading,
  onBulkApprove,
  isReferralOverdue,
  onToggleSelect,
  onToggleSelectAll,
  onApprove,
  onReject
}) => {
  return (
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
        onBulkApprove={onBulkApprove}
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
          onToggleSelect={onToggleSelect}
          onToggleSelectAll={onToggleSelectAll}
          onApprove={onApprove}
          onReject={onReject}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ReferralTabManager;
