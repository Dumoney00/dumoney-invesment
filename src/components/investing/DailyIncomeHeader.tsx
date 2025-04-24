
import React from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';

interface DailyIncomeHeaderProps {
  totalDailyIncome: number;
  investmentQuantity: number;
}

const DailyIncomeHeader: React.FC<DailyIncomeHeaderProps> = ({
  totalDailyIncome,
  investmentQuantity
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-gradient-to-r from-investment-gold to-yellow-500 rounded-xl p-4">
        <p className="text-white text-sm mb-1">Daily income</p>
        <div className="flex items-center gap-2">
          <DollarSign className="text-white" size={24} />
          <span className="text-white text-2xl font-bold">₹{totalDailyIncome.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-investment-gold to-yellow-500 rounded-xl p-4">
        <p className="text-white text-sm mb-1">Investment quantity</p>
        <div className="flex items-center gap-2">
          <TrendingUp className="text-white" size={24} />
          <span className="text-white text-2xl font-bold">{investmentQuantity}</span>
        </div>
      </div>
    </div>
  );
};

export default DailyIncomeHeader;
