
import React from 'react';
import { Product } from '@/types/products';
import { Calendar, DollarSign } from 'lucide-react';

interface InvestmentGridProps {
  investments: Product[];
}

const InvestmentGrid: React.FC<InvestmentGridProps> = ({ investments }) => {
  const groupedInvestments = investments.reduce((acc, item) => {
    const title = item.title;
    if (!acc[title]) {
      acc[title] = {
        ...item,
        count: 1,
        totalInvestment: item.price,
        totalDailyIncome: item.dailyIncome
      };
    } else {
      acc[title].count += 1;
      acc[title].totalInvestment += item.price;
      acc[title].totalDailyIncome += item.dailyIncome;
    }
    return acc;
  }, {} as Record<string, Product & { count: number; totalInvestment: number; totalDailyIncome: number }>);

  const calculateRemainingDays = (cycleDays: number = 45) => {
    // For this example, we're using a fixed start date
    const startDate = new Date('2024-04-24'); // Current date from the system
    const today = new Date();
    const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, cycleDays - daysPassed);
    return remainingDays;
  };

  const getNextIncomeDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      {Object.values(groupedInvestments).map((group) => (
        <div key={group.id} className="bg-[#333333] rounded-lg p-4">
          <div className="flex items-center gap-4 mb-4">
            <img src={group.image} alt={group.title} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-1">
              <h3 className="text-white font-medium">{group.title}</h3>
              <p className="text-gray-400 text-sm">Owned: {group.count}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div className="bg-black/30 p-3 rounded-lg">
              <p className="text-gray-400">Total Investment</p>
              <p className="text-investment-gold font-medium">₹{group.totalInvestment.toFixed(2)}</p>
            </div>
            <div className="bg-black/30 p-3 rounded-lg">
              <p className="text-gray-400">Daily Income</p>
              <p className="text-investment-gold font-medium">₹{group.totalDailyIncome.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-black/30 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Calendar size={14} />
                <span>Next Income</span>
              </div>
              <p className="text-investment-gold font-medium">{getNextIncomeDate()}</p>
            </div>
            <div className="bg-black/30 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <DollarSign size={14} />
                <span>Days Remaining</span>
              </div>
              <p className="text-investment-gold font-medium">
                {calculateRemainingDays(group.cycleDays)} days
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvestmentGrid;
