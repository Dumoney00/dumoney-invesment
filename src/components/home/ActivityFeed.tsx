
import React from 'react';
import { cn } from "@/lib/utils";
import { TransactionRecord, TransactionType } from '@/types/auth';

export interface Activity {
  id: string;
  username: string;
  amount: number;
  type: 'deposit' | 'withdraw' | 'investment' | 'referral' | 'sale' | 'dailyIncome' | 'referralBonus';
  timestamp: string;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
  productName?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  className?: string;
  showHeader?: boolean;
  showBankDetails?: boolean;
  filteredType?: Activity['type'] | 'all';
}

const mapTransactionToActivity = (transaction: TransactionRecord): Activity => {
  // Map transaction type to activity type
  let activityType: Activity['type'];
  
  switch (transaction.type) {
    case 'purchase':
      activityType = 'investment';
      break;
    case 'referralBonus':
      activityType = 'referralBonus';
      break;
    case 'dailyIncome':
      activityType = 'dailyIncome';
      break;
    case 'sale':
      activityType = 'sale';
      break;
    default:
      activityType = transaction.type as Activity['type'];
  }
  
  return {
    id: transaction.id,
    username: transaction.userName || 'Anonymous',
    amount: transaction.amount,
    type: activityType,
    timestamp: transaction.timestamp,
    bankDetails: transaction.bankDetails,
    productName: transaction.productName
  };
};

// Format time to be more readable and show relative time
const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - activityTime.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    if (days < 7) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return activityTime.toLocaleDateString();
    }
  }
};

// Export this function to be used by other components
export { mapTransactionToActivity };

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  activities, 
  className,
  showHeader = true,
  showBankDetails = false,
  filteredType = 'all'
}) => {
  // Filter activities if a specific type is requested
  const filteredActivities = filteredType === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filteredType);
  
  if (filteredActivities.length === 0) {
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
        {filteredActivities.map(activity => (
          <div 
            key={activity.id} 
            className="bg-[#222222] p-4 rounded-lg hover:bg-[#2a2a2a] transition-colors"
          >
            <div className="flex items-center mb-2">
              <div className="h-10 w-10 rounded-full bg-investment-gold/20 flex items-center justify-center mr-4">
                <span className="text-investment-gold text-2xl">✓</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{activity.username}</p>
                <div className="flex items-center">
                  <span className="text-investment-gold text-lg">₹{activity.amount.toLocaleString()}</span>
                  <span className="text-sm ml-2 text-gray-400">
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  </span>
                </div>
                <span className="text-gray-400 text-xs">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
              <div className="h-12 w-12">
                <img 
                  src={
                    activity.type === 'deposit' ? "/lovable-uploads/6efabb52-cf50-45d0-b356-7f37c5c2003a.png" :
                    activity.type === 'withdraw' ? "/lovable-uploads/e64e27ed-2f37-48aa-a277-fd7ad33b2e87.png" :
                    activity.type === 'investment' ? "/lovable-uploads/4b9b18f6-756a-4f3b-aafc-0f0501a3ce42.png" :
                    activity.type === 'sale' ? "/lovable-uploads/e5629de9-3d0b-4460-b0c5-fdf1020e6864.png" :
                    activity.type === 'dailyIncome' ? "/lovable-uploads/07ba0101-cb9b-416e-9796-7014c2aa2302.png" :
                    activity.type === 'referralBonus' ? "/lovable-uploads/39854854-dee8-4bf0-a045-eff7813c1370.png" :
                    "/lovable-uploads/5315140b-b55c-4211-85e0-8b4d86ed8ace.png"
                  } 
                  alt={`${activity.type} icon`}
                  className="w-full h-full object-contain" 
                />
              </div>
            </div>
            
            {/* Additional details section */}
            {(showBankDetails || activity.productName) && (
              <div className="mt-3 pt-2 border-t border-gray-700">
                {activity.productName && (
                  <p className="text-sm text-gray-300">
                    <span className="text-gray-400">Product:</span> {activity.productName}
                  </p>
                )}
                
                {showBankDetails && activity.bankDetails && (activity.type === 'deposit' || activity.type === 'withdraw') && (
                  <div className="mt-1 text-xs text-gray-300">
                    <p>
                      <span className="text-gray-400">Account Holder:</span> {activity.bankDetails.accountHolderName}
                    </p>
                    <p>
                      <span className="text-gray-400">Account:</span> {activity.bankDetails.accountNumber.slice(0, 4)}****{activity.bankDetails.accountNumber.slice(-4)}
                    </p>
                    <p>
                      <span className="text-gray-400">IFSC:</span> {activity.bankDetails.ifscCode}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
