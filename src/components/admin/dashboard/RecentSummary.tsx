
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionTable } from "@/components/admin/TransactionTable";
import { ActivityStream } from "@/components/admin/ActivityStream";
import { UserActivity } from "@/types/admin";

interface RecentSummaryProps {
  transactions: any[];
  activities: UserActivity[];
  onViewAllTransactions: () => void;
  onViewAllActivity: () => void;
}

const RecentSummary: React.FC<RecentSummaryProps> = ({ 
  transactions, 
  activities,
  onViewAllTransactions,
  onViewAllActivity
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-[#191919] border-gray-800">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable 
            transactions={transactions.slice(0, 5)} 
            compact={true}
          />
          
          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline" 
              onClick={onViewAllTransactions}
            >
              View All Transactions
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-[#191919] border-gray-800">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityStream 
            activities={activities.slice(0, 5)}
            compact={true}
          />
          
          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline" 
              onClick={onViewAllActivity}
            >
              View All Activity
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentSummary;
