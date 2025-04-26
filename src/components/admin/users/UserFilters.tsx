
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: 'all' | 'active' | 'blocked') => void;
}

export const UserFilters = ({ searchTerm, onSearchChange, onFilterChange }: UserFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative w-full md:w-64">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="bg-[#1A1F2C] border-[#33374D] text-white pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="border-[#33374D] bg-[#1A1F2C] text-gray-400 hover:bg-[#33374D] hover:text-white"
            >
              <Filter size={18} className="mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#1A1F2C] border-[#33374D] text-white">
            <DropdownMenuItem onClick={() => onFilterChange('all')} className="hover:bg-[#33374D]">
              All Users
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('active')} className="hover:bg-[#33374D]">
              Active Users
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('blocked')} className="hover:bg-[#33374D]">
              Blocked Users
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Button className="bg-[#8B5CF6] text-white hover:bg-[#7B5CF6] w-full md:w-auto">
          Add New User
        </Button>
      </div>
    </div>
  );
};
