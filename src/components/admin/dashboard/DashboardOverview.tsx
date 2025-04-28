
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, CreditCard, ArrowUp, ArrowDown, Users } from 'lucide-react';
import { User as UserType, TransactionRecord } from '@/types/auth';
import { Line } from 'recharts';
import ActivityChart from '../activity/ActivityChart';
import UserStatsCards from '../stats/UserStatsCards';
import LatestUsers from './LatestUsers';
import RecentTransactions from './RecentTransactions';
import { useAllUserTransactions } from '@/hooks/useAllUserTransactions';

interface DashboardOverviewProps {
  users: UserType[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ users }) => {
  const { transactions } = useAllUserTransactions();
  
  // Calculate various statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(user => !user.isBlocked).length;
  const totalDeposits = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Get latest users (5 most recent)
  const latestUsers = [...users]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 5);
    
  // Get recent transactions (5 most recent)
  const recentTransactions = [...transactions]
    .sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 5);
  
  return (
    <div className="space-y-6">
      <UserStatsCards />
      
      {/* Data overview grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart section */}
        <Card className="col-span-1 lg:col-span-2 bg-[#222B45]/80 border-[#33374D]">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Activity Overview</h3>
              <div className="text-sm text-gray-400">Last 7 days</div>
            </div>
            
            <ActivityChart height={250} />
          </CardContent>
        </Card>
        
        {/* Latest users */}
        <Card className="bg-[#222B45]/80 border-[#33374D]">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">Latest Users</h3>
            <LatestUsers users={latestUsers} />
          </CardContent>
        </Card>
      </div>
      
      {/* Recent transactions */}
      <Card className="bg-[#222B45]/80 border-[#33374D]">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">Recent Transactions</h3>
          <RecentTransactions transactions={recentTransactions} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
