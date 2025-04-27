import React, { useState } from 'react';
import { UsersRound, TrendingUp, Download, Upload, LineChart } from 'lucide-react';
import { useAllUsers } from '@/hooks/useAllUsers';
import { useAllUserTransactions } from '@/hooks/useAllUserTransactions';
import DashboardStatsCard from './stats/DashboardStatsCard';
import ActivityChart from './activity/ActivityChart';
import ActivityFeed from './activity/ActivityFeed';
import { ChartDataPoint, generateChartData } from '@/utils/chartUtils';

const AdminOverviewPanel: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('weekly');
  const { users } = useAllUsers();
  const { transactions } = useAllUserTransactions();
  
  const totalUsers = users.length;
  const activeUsers = users.filter(u => !u.isBlocked).length;
  const dailyActiveUsers = users.filter(u => 
    new Date(u.lastIncomeCollection || '').toDateString() === new Date().toDateString()
  ).length;

  const totalDeposits = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0);

  const getTodayTransactions = (type: string) => {
    const today = new Date().toDateString();
    return transactions.filter(t => 
      t.type === type && 
      new Date(t.timestamp).toDateString() === today
    ).length;
  };

  const todayDeposits = getTodayTransactions('deposit');
  const todayWithdrawals = getTodayTransactions('withdraw');
  const todayPurchases = getTodayTransactions('purchase');

  const getLast7DaysData = () => {
    const data: ChartDataPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayTransactions = transactions.filter(t => 
        new Date(t.timestamp).toDateString() === date.toDateString()
      );

      data.push({
        name: dateStr,
        deposits: dayTransactions.filter(t => t.type === 'deposit').length,
        withdrawals: dayTransactions.filter(t => t.type === 'withdraw').length,
        purchases: dayTransactions.filter(t => t.type === 'purchase').length
      });
    }
    return data;
  };

  const activityData = getLast7DaysData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatsCard 
          title="Total Users"
          value={totalUsers.toString()}
          subtitle={`${activeUsers} active`}
          trend="up"
          icon={UsersRound}
          iconColor="bg-blue-500"
        />
        <DashboardStatsCard 
          title="Today's Activity"
          value={`${todayDeposits + todayWithdrawals + todayPurchases}`}
          subtitle="Total transactions"
          trend="up"
          icon={LineChart}
          iconColor="bg-green-500"
        />
        <DashboardStatsCard 
          title="Total Deposits"
          value={`₹${totalDeposits.toLocaleString()}`}
          subtitle={`${todayDeposits} today`}
          trend="up"
          icon={Download}
          iconColor="bg-purple-500"
        />
        <DashboardStatsCard 
          title="Total Withdrawals"
          value={`₹${totalWithdrawals.toLocaleString()}`}
          subtitle={`${todayWithdrawals} today`}
          trend="up"
          icon={Upload}
          iconColor="bg-amber-500"
        />
      </div>

      <ActivityChart 
        data={activityData}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      <ActivityFeed transactions={transactions} />
    </div>
  );
};

export default AdminOverviewPanel;
