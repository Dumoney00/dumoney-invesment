
import React from 'react';

interface Activity {
  id: number;
  username: string;
  amount: number;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div>
      <h2 className="text-center text-gray-400 mb-4 text-lg">— Dynamic info —</h2>
      
      <div className="space-y-4">
        {activities.map(activity => (
          <div key={activity.id} className="bg-[#222222] p-4 rounded-lg flex items-center">
            <div className="h-10 w-10 rounded-full bg-investment-gold/20 flex items-center justify-center mr-4">
              <span className="text-investment-gold text-2xl">✓</span>
            </div>
            <div className="flex-1 text-white">
              <p>
                <span className="text-white">{activity.username}</span> successfully
                <br />
                recharge <span className="text-investment-gold">₹{activity.amount.toLocaleString()}</span>
              </p>
            </div>
            <div className="h-12 w-12 ml-2">
              <img 
                src={Math.random() > 0.5 ? "/lovable-uploads/6efabb52-cf50-45d0-b356-7f37c5c2003a.png" : "/lovable-uploads/e64e27ed-2f37-48aa-a277-fd7ad33b2e87.png"} 
                alt="Activity icon" 
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
