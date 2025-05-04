
import React from 'react';
import { Activity } from '@/types/activity';
import ActivityItem from './ActivityItem';
import { Card, CardContent } from "@/components/ui/card";

interface ActivityFeedProps {
  activities: Activity[];
  showHeader?: boolean;
  showBankDetails?: boolean;
  filteredType?: 'all' | 'deposit' | 'withdraw' | 'investment' | 'referralBonus' | 'dailyIncome';
  filteredUserId?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  activities, 
  showHeader = true,
  showBankDetails = false,
  filteredType = 'all',
  filteredUserId = 'all'
}) => {
  // Filter activities by type if specified
  const filteredActivities = activities.filter(activity => {
    // Filter by type if specified
    if (filteredType !== 'all' && activity.type !== filteredType) {
      return false;
    }
    
    // Filter by user ID if specified
    if (filteredUserId !== 'all' && activity.userId !== filteredUserId) {
      return false;
    }
    
    return true;
  });

  if (filteredActivities.length === 0) {
    return (
      <Card className="bg-[#191919] border-gray-800">
        <CardContent className="p-4">
          <p className="text-center text-gray-400 py-8">No activities to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {showHeader && (
        <h3 className="text-white font-medium mb-2">Recent Activities</h3>
      )}
      
      {filteredActivities.map((activity) => (
        <ActivityItem 
          key={activity.id}
          activity={activity}
          showBankDetails={showBankDetails}
        />
      ))}
    </div>
  );
};

export default ActivityFeed;
