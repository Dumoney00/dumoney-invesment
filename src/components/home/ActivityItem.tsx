
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from '@/types/activity';
import { formatTimeAgo } from '@/utils/timeUtils';
import { ArrowDown, ArrowUp, ShoppingBag, CreditCard, Clock, Users } from "lucide-react";
import { cn } from '@/lib/utils';

interface ActivityItemProps {
  activity: Activity;
  showBankDetails?: boolean;
  className?: string;
  isNew?: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ 
  activity, 
  showBankDetails = false, 
  className = "",
  isNew = false
}) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'deposit':
        return <ArrowDown size={16} className="text-green-500" />;
      case 'withdraw':
        return <ArrowUp size={16} className="text-amber-500" />;
      case 'investment':
      case 'purchase':
        return <ShoppingBag size={16} className="text-purple-500" />;
      case 'dailyIncome':
        return <CreditCard size={16} className="text-blue-500" />;
      case 'referralBonus':
        return <Users size={16} className="text-investment-gold" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };
  
  const getTypeColor = () => {
    switch (activity.type) {
      case 'deposit':
        return 'text-green-500';
      case 'withdraw':
        return 'text-amber-500';
      case 'investment':
      case 'purchase':
        return 'text-purple-500';
      case 'dailyIncome':
        return 'text-blue-500';
      case 'referralBonus':
        return 'text-investment-gold';
      default:
        return 'text-gray-300';
    }
  };

  const getCardClasses = () => {
    let classes = "bg-[#191919] border-gray-800";
    if (isNew) classes += " animate-pulse border-green-500/30";
    return classes;
  };
  
  return (
    <Card className={cn(getCardClasses(), className)}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-full ${isNew ? 'bg-green-900/30' : 'bg-black/30'} flex items-center justify-center`}>
              {getActivityIcon()}
            </div>
            <div>
              <p className="text-white text-sm">
                {activity.username}{' '}
                <span className={`${getTypeColor()} text-xs`}>
                  {activity.type === 'investment' ? 'purchased' : activity.type}
                </span>
                {isNew && (
                  <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
                    New
                  </span>
                )}
              </p>
              <p className="text-gray-400 text-xs">
                {activity.details || `${activity.type} transaction`}
                {' '}
                <span className="text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
              </p>
              
              {showBankDetails && activity.bankDetails && (activity.type === 'withdraw' || activity.type === 'deposit') && (
                <div className="bg-black/30 mt-1 p-1 rounded">
                  <p className="text-xs text-gray-400">
                    Bank: Account ending with XXX{activity.bankDetails.accountNumber.slice(-3)}
                  </p>
                </div>
              )}
              
              {activity.productName && (
                <div className="bg-black/30 mt-1 p-1 rounded">
                  <p className="text-xs text-gray-400">
                    Product: {activity.productName}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className={`font-medium ${activity.type === 'deposit' || activity.type === 'dailyIncome' || activity.type === 'referralBonus' ? 'text-green-500' : 'text-amber-500'}`}>
              {activity.type === 'deposit' || activity.type === 'dailyIncome' || activity.type === 'referralBonus' ? '+' : '-'}₹{activity.amount.toFixed(2)}
            </p>
            {activity.status && (
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                activity.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                activity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                'bg-red-500/20 text-red-400'
              }`}>
                {activity.status}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityItem;
