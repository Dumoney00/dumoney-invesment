
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  icon: LucideIcon;
  iconClass: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ 
  title, 
  description, 
  time, 
  icon: Icon, 
  iconClass 
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${iconClass} mt-1`}>
        <Icon size={16} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-white">{title}</h4>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <div className="text-xs text-gray-500">{time}</div>
    </div>
  );
};

export default ActivityItem;
