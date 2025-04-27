
import React from 'react';
import { TransactionType } from '@/types/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, LineChart, TrendingUp, Upload } from 'lucide-react';
import ActivityItem from './ActivityItem';

const getTransactionIcon = (type: TransactionType) => {
  switch (type) {
    case 'deposit':
      return Download;
    case 'withdraw':
      return Upload;
    case 'purchase':
      return TrendingUp;
    default:
      return LineChart;
  }
};

const getTransactionIconClass = (type: TransactionType) => {
  switch (type) {
    case 'deposit':
      return 'bg-green-500/20 text-green-500';
    case 'withdraw':
      return 'bg-amber-500/20 text-amber-500';
    case 'purchase':
      return 'bg-purple-500/20 text-purple-500';
    default:
      return 'bg-blue-500/20 text-blue-500';
  }
};

const ActivityFeed = ({ transactions }: { transactions: any[] }) => {
  return (
    <Card className="bg-[#222B45]/80 border-[#33374D]">
      <CardHeader>
        <CardTitle className="text-white">Real-time Activity Feed</CardTitle>
        <CardDescription className="text-gray-400">
          Latest user activities across the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions
            .slice(0, 5)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map((transaction) => (
              <ActivityItem 
                key={transaction.id}
                title={`${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}`}
                description={`${transaction.userName || 'User'} - ₹${transaction.amount}`}
                time={new Date(transaction.timestamp).toLocaleString()}
                icon={getTransactionIcon(transaction.type)}
                iconClass={getTransactionIconClass(transaction.type)}
              />
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
