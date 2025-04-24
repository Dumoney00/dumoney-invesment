
import React from 'react';
import InvestmentCard from '@/components/InvestmentCard';
import { Product } from '@/types/products';

interface InvestmentGridProps {
  investments: Product[];
  onSellProduct: (productId: number) => void;
}

const InvestmentGrid: React.FC<InvestmentGridProps> = ({ investments, onSellProduct }) => {
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
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-black/30 p-3 rounded-lg">
              <p className="text-gray-400">Total Investment</p>
              <p className="text-investment-gold font-medium">₹{group.totalInvestment.toFixed(2)}</p>
            </div>
            <div className="bg-black/30 p-3 rounded-lg">
              <p className="text-gray-400">Daily Income</p>
              <p className="text-investment-gold font-medium">₹{group.totalDailyIncome.toFixed(2)}</p>
            </div>
          </div>
          
          <button 
            className="w-full mt-4 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            onClick={() => onSellProduct(group.id)}
          >
            Sell
          </button>
        </div>
      ))}
    </div>
  );
};

export default InvestmentGrid;
