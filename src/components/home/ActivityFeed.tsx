
import React, { useEffect, useState } from 'react';
import { Activity } from '@/types/activity';
import ActivityItem from './ActivityItem';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface ActivityFeedProps {
  activities: Activity[];
  showHeader?: boolean;
  showBankDetails?: boolean;
  filteredType?: 'all' | 'deposit' | 'withdraw' | 'investment' | 'referralBonus' | 'dailyIncome';
  filteredUserId?: string;
  maxHeight?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  activities, 
  showHeader = true,
  showBankDetails = false,
  filteredType = 'all',
  filteredUserId = 'all',
  maxHeight
}) => {
  const [newActivity, setNewActivity] = useState<boolean>(false);
  const [newActivities, setNewActivities] = useState<Set<string>>(new Set());
  const prevLengthRef = React.useRef(activities.length);
  const prevActivitiesRef = React.useRef<string[]>([]);
  
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
    // Create sets of activity IDs
    const prevActivityIds = new Set(prevActivitiesRef.current);
    const currentActivityIds = new Set(filteredActivities.map(a => a.id));
    
    // Find new activities (in current set but not in previous set)
    const newActivityIds = new Set<string>();
    currentActivityIds.forEach(id => {
      if (!prevActivityIds.has(id)) {
        newActivityIds.add(id);
      }
    });
    
    if (newActivityIds.size > 0) {
      setNewActivity(true);
      setNewActivities(newActivityIds);
      
      // Play notification sound
      try {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
      } catch (error) {
        console.error('Failed to play notification sound:', error);
      }
      
      // Reset the animation after 5 seconds
      const timer = setTimeout(() => {
        setNewActivity(false);
        setNewActivities(new Set());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    
    // Update refs for next comparison
    prevLengthRef.current = filteredActivities.length;
    prevActivitiesRef.current = filteredActivities.map(a => a.id);
  }, [filteredActivities]);

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
      
      <div className={`space-y-2 ${maxHeight ? `max-h-[${maxHeight}] overflow-auto` : ''}`}>
        <AnimatePresence>
          {filteredActivities.map((activity, index) => (
            <motion.div 
              key={activity.id}
              initial={newActivities.has(activity.id) ? { opacity: 0, y: -20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ActivityItem 
                activity={activity}
                showBankDetails={showBankDetails}
                isNew={newActivities.has(activity.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ActivityFeed;
