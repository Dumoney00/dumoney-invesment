
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTransactionIcon, getTransactionIconClass } from '@/utils/transactionUtils';
import ActivityItem from './ActivityItem';

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
