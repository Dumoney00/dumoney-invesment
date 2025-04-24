
import React from 'react';
import { IndianRupee, TrendingUp } from 'lucide-react';

interface DailyIncomeHeaderProps {
  totalDailyIncome: number;
  totalInvestment: number;
}

const DailyIncomeHeader: React.FC<DailyIncomeHeaderProps> = ({
  totalDailyIncome,
  totalInvestment
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-gradient-to-r from-investment-gold to-yellow-500 rounded-xl p-4">
        <p className="text-white text-sm mb-1">Daily income</p>
        <div className="flex items-center gap-2">
          <IndianRupee className="text-white" size={24} />
          <span className="text-white text-2xl font-bold">₹{totalDailyIncome.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-investment-gold to-yellow-500 rounded-xl p-4">
        <p className="text-white text-sm mb-1">Total Investment</p>
        <div className="flex items-center gap-2">
          <TrendingUp className="text-white" size={24} />
          <span className="text-white text-2xl font-bold">₹{totalInvestment.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default DailyIncomeHeader;
