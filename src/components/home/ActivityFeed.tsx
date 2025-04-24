
import React from 'react';
import { cn } from "@/lib/utils";
import { TransactionRecord } from '@/types/auth';

export interface Activity {
  id: string;
  username: string;
  amount: number;
  type: 'deposit' | 'withdraw' | 'investment' | 'referral';
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  className?: string;
  showHeader?: boolean;
}

const mapTransactionToActivity = (transaction: TransactionRecord): Activity => ({
  id: transaction.id,
  username: transaction.userName || 'Anonymous',
  amount: transaction.amount,
  type: transaction.type === 'purchase' ? 'investment' : transaction.type,
  timestamp: transaction.timestamp
});

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  activities, 
  className,
  showHeader = true 
}) => {
  if (activities.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-gray-400">No activities to display yet</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {showHeader && (
        <h2 className="text-center text-gray-400 mb-4 text-lg">— Latest Activities —</h2>
      )}
      
      <div className="space-y-4">
        {activities.map(activity => (
          <div 
            key={activity.id} 
            className="bg-[#222222] p-4 rounded-lg flex items-center"
          >
            <div className="h-10 w-10 rounded-full bg-investment-gold/20 flex items-center justify-center mr-4">
              <span className="text-investment-gold text-2xl">✓</span>
            </div>
            <div className="flex-1">
              <p className="text-white">
                <span className="text-white">{activity.username}</span>
                <br />
                <span className="text-investment-gold">₹{activity.amount.toLocaleString()}</span>
                <span className="text-sm ml-2 text-gray-400">
                  {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                </span>
                <span className="text-gray-400 text-sm ml-2">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </p>
            </div>
            <div className="h-12 w-12 ml-2">
              <img 
                src={
                  activity.type === 'deposit' ? "/lovable-uploads/6efabb52-cf50-45d0-b356-7f37c5c2003a.png" :
                  activity.type === 'withdraw' ? "/lovable-uploads/e64e27ed-2f37-48aa-a277-fd7ad33b2e87.png" :
                  activity.type === 'investment' ? "/lovable-uploads/4b9b18f6-756a-4f3b-aafc-0f0501a3ce42.png" :
                  "/lovable-uploads/5315140b-b55c-4211-85e0-8b4d86ed8ace.png"
                } 
                alt={`${activity.type} icon`}
                className="w-full h-full object-contain" 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
