
import React from 'react';
import { Activity } from '@/types/activity';
import { formatTimeAgo } from '@/utils/timeUtils';

interface ActivityItemProps {
  activity: Activity;
  showBankDetails: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, showBankDetails }) => {
  return (
    <div 
      className="bg-[#222222] p-4 rounded-lg hover:bg-[#2a2a2a] transition-colors"
    >
      <div className="flex items-center mb-2">
        <div className="h-10 w-10 rounded-full bg-investment-gold/20 flex items-center justify-center mr-4">
          <span className="text-investment-gold text-2xl">✓</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <p className="text-white font-medium">{activity.username}</p>
            <span className="text-xs text-gray-400">({activity.userId.substring(0, 8)})</span>
          </div>
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
      <div className="mt-3 pt-2 border-t border-gray-700">
        {activity.deviceInfo && (
          <div className="mb-2 text-xs text-gray-300">
            <p className="text-gray-400">Device Info</p>
            <div className="flex gap-3 mt-1">
              <span>Type: {activity.deviceInfo.type || 'Unknown'}</span>
              <span>OS: {activity.deviceInfo.os || 'Unknown'}</span>
              {activity.deviceInfo.location && <span>Location: {activity.deviceInfo.location}</span>}
            </div>
          </div>
        )}
        
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
    </div>
  );
};

export default ActivityItem;
