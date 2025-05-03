
import React from 'react';
import { cn } from "@/lib/utils";
import ActivityItem from './ActivityItem';
import { Activity } from '@/types/activity';

// Re-export the types and utility functions for compatibility
export type { Activity } from '@/types/activity';
export { mapTransactionToActivity } from '@/types/activity';

interface ActivityFeedProps {
  activities: Activity[];
  className?: string;
  showHeader?: boolean;
  showBankDetails?: boolean;
  filteredType?: Activity['type'] | 'all';
  filteredUserId?: string | 'all';
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  activities, 
  className,
  showHeader = true,
  showBankDetails = false,
  filteredType = 'all',
  filteredUserId = 'all'
}) => {
  // Filter activities if a specific type is requested
  let filteredActivities = activities;
  
  if (filteredType !== 'all') {
    filteredActivities = filteredActivities.filter(activity => activity.type === filteredType);
  }
  
  if (filteredUserId !== 'all') {
    filteredActivities = filteredActivities.filter(activity => activity.userId === filteredUserId);
  }
  
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
          <ActivityItem 
            key={activity.id} 
            activity={activity} 
            showBankDetails={showBankDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
