
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AdminHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 h-16 bg-[#222B45]/80 backdrop-blur-lg border-b border-[#33374D] flex items-center px-6">
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-white">Admin Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 text-gray-400" size={16} />
          <Input 
            placeholder="Search..." 
            className="pl-9 bg-[#1A1F2C]/50 border-[#33374D] text-white w-60 h-9"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white relative">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <div>
          <span className="px-3 py-1 rounded-full text-xs bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
