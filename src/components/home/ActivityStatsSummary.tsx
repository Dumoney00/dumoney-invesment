
import React from 'react';
import { ActivityStats } from '@/hooks/activities/useActivities';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface ActivityStatsSummaryProps {
  stats: ActivityStats;
}

const ActivityStatsSummary: React.FC<ActivityStatsSummaryProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-900/20 flex items-center justify-center">
              <ArrowDown className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Today Deposits</p>
              <p className="text-white font-semibold text-lg">₹{stats.todayDeposits.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-[#1a1a1a] border-gray-800">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-900/20 flex items-center justify-center">
              <ArrowUp className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Today Withdrawals</p>
              <p className="text-white font-semibold text-lg">₹{stats.todayWithdrawals.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityStatsSummary;
