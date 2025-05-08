
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { UserActivity } from "@/types/admin";
import { 
  LogIn, 
  LogOut, 
  Download, 
  Upload, 
  ShoppingCart,
  DollarSign,
  Users,
  Activity,
  Settings,
  AlertTriangle
} from 'lucide-react';

interface ActivityStreamProps {
  activities: UserActivity[];
  compact?: boolean;
}

export const ActivityStream: React.FC<ActivityStreamProps> = ({ 
  activities,
  compact = false 
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <LogIn className="h-4 w-4 text-green-500" />;
      case 'logout':
        return <LogOut className="h-4 w-4 text-amber-500" />;
      case 'deposit':
        return <Download className="h-4 w-4 text-blue-500" />;
      case 'withdraw':
        return <Upload className="h-4 w-4 text-indigo-500" />;
      case 'purchase':
      case 'investment':
        return <ShoppingCart className="h-4 w-4 text-purple-500" />;
      case 'daily_income':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'register':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'settings':
        return <Settings className="h-4 w-4 text-gray-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No activities found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div 
          key={activity.id}
          className="flex items-start space-x-3 p-3 bg-gray-900/40 rounded-lg border border-gray-800"
        >
          <div className="bg-gray-800 p-2 rounded-full">
            {getActivityIcon(activity.activity_type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white truncate">
                {activity.username || 'Unknown User'}
              </p>
              <p className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </p>
            </div>
            
            <p className="text-sm text-gray-400 mt-1">
              {activity.details || `Performed ${activity.activity_type} action`}
              {activity.amount !== undefined && activity.amount !== null && (
                <span className="ml-1 font-mono">
                  (₹{activity.amount.toString()})
                </span>
              )}
            </p>
            
            {!compact && activity.ip_address && (
              <p className="text-xs text-gray-500 mt-1">
                IP: {activity.ip_address}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
