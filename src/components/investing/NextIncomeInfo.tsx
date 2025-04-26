
import React from 'react';
import { CalendarClock } from 'lucide-react';
import { User } from '@/types/auth';
import { formatDate } from '@/utils/dateUtils';

interface NextIncomeInfoProps {
  user: User | null;
}

const NextIncomeInfo: React.FC<NextIncomeInfoProps> = ({ user }) => {
  if (!user || user.dailyIncome <= 0) return null;
  
  const getNextIncomeTime = () => {
    const now = new Date();
    const nextIncome = new Date();
    
    // If it's already past 9 AM, set for next day
    if (now.getHours() >= 9) {
      nextIncome.setDate(nextIncome.getDate() + 1);
    }
    
    // Set time to 9 AM
    nextIncome.setHours(9, 0, 0, 0);
    
    return nextIncome;
  };
  
  const nextIncomeTime = getNextIncomeTime();
  
  return (
    <div className="bg-[#222222] rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarClock className="text-investment-gold" />
          <span className="text-gray-400">Next Income Collection</span>
        </div>
        <div className="text-right">
          <p className="text-investment-gold text-xl font-bold">
            ₹{user.dailyIncome.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">
            at {formatDate(nextIncomeTime)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NextIncomeInfo;
