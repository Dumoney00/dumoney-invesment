
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  onRefresh: () => void;
  onSignout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onRefresh, onSignout }) => {
  return (
    <header className="bg-[#191919] border-b border-gray-800 px-4 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-investment-gold text-2xl font-bold">Admin Dashboard</h1>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefresh}
          >
            <RefreshCw size={16} className="mr-1" />
            Refresh
          </Button>
          
          <Button 
            variant="destructive" 
            size="sm"
            onClick={onSignout}
          >
            <LogOut size={16} className="mr-1" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
