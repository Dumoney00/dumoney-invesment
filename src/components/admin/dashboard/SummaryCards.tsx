
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Wallet, Users, Activity } from 'lucide-react';

interface SummaryCardsProps {
  summaryStats: {
    totalDeposits: number;
    totalWithdrawals: number;
    totalUsers: number;
    activeUsers: number;
  };
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summaryStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-[#191919] border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-400">Total Deposits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Wallet className="h-5 w-5 text-green-500 mr-2" />
            <div className="text-2xl font-bold text-white">₹{summaryStats.totalDeposits.toLocaleString()}</div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-[#191919] border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-400">Total Withdrawals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Wallet className="h-5 w-5 text-amber-500 mr-2" />
            <div className="text-2xl font-bold text-white">₹{summaryStats.totalWithdrawals.toLocaleString()}</div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-[#191919] border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-400">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-blue-500 mr-2" />
            <div className="text-2xl font-bold text-white">{summaryStats.totalUsers}</div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-[#191919] border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-400">Active Users (7d)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-purple-500 mr-2" />
            <div className="text-2xl font-bold text-white">{summaryStats.activeUsers}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
