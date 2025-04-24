
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TransactionFiltersProps {
  searchTerm: string;
  filter: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  searchTerm,
  filter,
  statusFilter,
  onSearchChange,
  onFilterChange,
  onStatusFilterChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative w-full md:w-64">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-[#1A1F2C] border-[#33374D] text-white pl-10"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3 w-full md:w-auto">
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[150px] bg-[#1A1F2C] border-[#33374D] text-white">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1F2C] border-[#33374D] text-white">
            <SelectItem value="all" className="hover:bg-[#33374D]">All Types</SelectItem>
            <SelectItem value="withdraw" className="hover:bg-[#33374D]">Withdrawals</SelectItem>
            <SelectItem value="deposit" className="hover:bg-[#33374D]">Deposits</SelectItem>
            <SelectItem value="purchase" className="hover:bg-[#33374D]">Purchases</SelectItem>
            <SelectItem value="sale" className="hover:bg-[#33374D]">Sales</SelectItem>
            <SelectItem value="dailyIncome" className="hover:bg-[#33374D]">Daily Income</SelectItem>
            <SelectItem value="referralBonus" className="hover:bg-[#33374D]">Referral Bonus</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[150px] bg-[#1A1F2C] border-[#33374D] text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1F2C] border-[#33374D] text-white">
            <SelectItem value="all" className="hover:bg-[#33374D]">All Status</SelectItem>
            <SelectItem value="pending" className="hover:bg-[#33374D]">Pending</SelectItem>
            <SelectItem value="completed" className="hover:bg-[#33374D]">Completed</SelectItem>
            <SelectItem value="failed" className="hover:bg-[#33374D]">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TransactionFilters;
