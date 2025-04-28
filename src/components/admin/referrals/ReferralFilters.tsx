
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReferralStatus } from '@/types/referrals';

interface ReferralFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  activeTab: string;
  statusFilter: ReferralStatus | 'all';
  setStatusFilter: (value: ReferralStatus | 'all') => void;
  dateFilter: 'all' | 'today' | 'week' | 'month';
  setDateFilter: (value: 'all' | 'today' | 'week' | 'month') => void;
  selectedReferrals: string[];
  loading: boolean;
  onBulkApprove: () => void;
}

export const ReferralFilters: React.FC<ReferralFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  activeTab,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  selectedReferrals,
  loading,
  onBulkApprove
}) => {
  return (
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
            onClick={onBulkApprove}
          >
            <Check size={16} className="mr-1" />
            Bulk Approve ({selectedReferrals.length})
          </Button>
        </>
      )}
    </div>
  );
};
