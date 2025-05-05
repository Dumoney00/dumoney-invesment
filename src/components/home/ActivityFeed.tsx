
import React, { useEffect } from 'react';
import { Activity } from '@/types/activity';
import ActivityItem from './ActivityItem';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const [newActivity, setNewActivity] = React.useState<boolean>(false);
  const [animateIndex, setAnimateIndex] = React.useState<number | null>(null);
  const prevLengthRef = React.useRef(activities.length);
  
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

  // Check for new activities
  useEffect(() => {
    if (filteredActivities.length > prevLengthRef.current) {
      setNewActivity(true);
      setAnimateIndex(0); // Animate the newest activity
      
      // Reset the animation after 3 seconds
      const timer = setTimeout(() => {
        setNewActivity(false);
        setAnimateIndex(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
    
    prevLengthRef.current = filteredActivities.length;
  }, [filteredActivities.length]);

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
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white font-medium">Recent Activities</h3>
          {newActivity && (
            <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-500/30 animate-pulse">
              New Activity
            </Badge>
          )}
        </div>
      )}
      
      {filteredActivities.map((activity, index) => (
        <ActivityItem 
          key={activity.id}
          activity={activity}
          showBankDetails={showBankDetails}
          className={animateIndex === index ? "animate-pulse bg-green-900/20" : ""}
        />
      ))}
    </div>
  );
};

export default ActivityFeed;
