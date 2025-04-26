
import React from 'react';
import { CalendarClock, AlertTriangle } from 'lucide-react';
import { User } from '@/types/auth';
import { formatDate } from '@/utils/dateUtils';
import { investmentData } from '@/data/investments';

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

  const getExpiringPlansInfo = () => {
    const now = new Date();
    const expiringPlans = user.ownedProducts.filter(owned => {
      const product = investmentData.find(p => p.id === owned.productId);
      if (!product) return false;

      const purchaseDate = new Date(owned.purchaseDate);
      const daysSincePurchase = Math.floor(
        (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      const daysRemaining = owned.cycleDays - daysSincePurchase;
      return daysRemaining <= 5 && daysRemaining > 0;
    });

    return expiringPlans;
  };
  
  const expiringPlans = getExpiringPlansInfo();
  const nextIncomeTime = getNextIncomeTime();
  
  return (
    <div className="space-y-4">
      <div className="bg-[#222222] rounded-lg p-4">
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

      {expiringPlans.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-600/20 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="text-yellow-500 shrink-0 mt-1" />
            <div>
              <p className="text-yellow-500 font-medium">Plans Expiring Soon</p>
              <div className="text-sm text-yellow-500/80 mt-1">
                {expiringPlans.map(plan => {
                  const product = investmentData.find(p => p.id === plan.productId);
                  const purchaseDate = new Date(plan.purchaseDate);
                  const now = new Date();
                  const daysSincePurchase = Math.floor(
                    (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const daysRemaining = plan.cycleDays - daysSincePurchase;

                  return (
                    <p key={plan.productId}>
                      {product?.title}: {daysRemaining} days remaining
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NextIncomeInfo;
