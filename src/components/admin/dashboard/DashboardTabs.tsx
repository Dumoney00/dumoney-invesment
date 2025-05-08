
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3, ArrowLeftRight, Users, Activity } from 'lucide-react';
import { TransactionTable } from "@/components/admin/TransactionTable";
import { UserStatsTable } from "@/components/admin/UserStatsTable";
import { ActivityStream } from "@/components/admin/ActivityStream";
import { UserActivity, TransactionSummary } from "@/types/admin";

import SummaryCards from './SummaryCards';
import TransactionChart from './TransactionChart';
import RecentSummary from './RecentSummary';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  summaryStats: {
    totalDeposits: number;
    totalWithdrawals: number;
    totalUsers: number;
    activeUsers: number;
  };
  chartData: any[];
  transactions: any[];
  activities: UserActivity[];
  stats: TransactionSummary[];
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  onTabChange,
  summaryStats,
  chartData,
  transactions,
  activities,
  stats,
}) => {
  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={onTabChange}>
      <TabsList className="bg-[#191919] border border-gray-800">
        <TabsTrigger value="overview" className="data-[state=active]:bg-investment-gold data-[state=active]:text-black">
          <BarChart3 size={16} className="mr-2" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="transactions" className="data-[state=active]:bg-investment-gold data-[state=active]:text-black">
          <ArrowLeftRight size={16} className="mr-2" />
          Transactions
        </TabsTrigger>
        <TabsTrigger value="users" className="data-[state=active]:bg-investment-gold data-[state=active]:text-black">
          <Users size={16} className="mr-2" />
          Users
        </TabsTrigger>
        <TabsTrigger value="activity" className="data-[state=active]:bg-investment-gold data-[state=active]:text-black">
          <Activity size={16} className="mr-2" />
          Activity
        </TabsTrigger>
      </TabsList>
      
      <div className="mt-6">
        <TabsContent value="overview">
          <SummaryCards summaryStats={summaryStats} />
          <TransactionChart chartData={chartData} />
          <RecentSummary 
            transactions={transactions} 
            activities={activities}
            onViewAllTransactions={() => onTabChange('transactions')}
            onViewAllActivity={() => onTabChange('activity')}
          />
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card className="bg-[#191919] border-gray-800">
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionTable transactions={transactions} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card className="bg-[#191919] border-gray-800">
            <CardHeader>
              <CardTitle>User Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <UserStatsTable stats={stats} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card className="bg-[#191919] border-gray-800">
            <CardHeader>
              <CardTitle>User Activity Stream</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityStream activities={activities} />
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default DashboardTabs;
