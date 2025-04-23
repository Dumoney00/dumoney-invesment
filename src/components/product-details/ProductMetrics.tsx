
import React from 'react';

interface ProductMetricsProps {
  hourlyIncome: number;
  dailyIncome: number;
  cycleDays: number;
  totalIncome: number;
}

const ProductMetrics: React.FC<ProductMetricsProps> = ({
  hourlyIncome,
  dailyIncome,
  cycleDays,
  totalIncome,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <span>Purchase quantity limit:</span>
        <span className="text-red-500 font-bold">0/10</span>
      </div>
      
      <div className="flex justify-between">
        <span>Hourly income:</span>
        <span className="font-bold text-white">₹{hourlyIncome}</span>
      </div>
      
      <div className="flex justify-between">
        <span>Daily income:</span>
        <span className="font-bold text-white">₹{dailyIncome.toLocaleString()}</span>
      </div>
      
      <div className="flex justify-between">
        <span>Cycle days:</span>
        <span className="font-bold text-white">{cycleDays} days</span>
      </div>
      
      <div className="flex justify-between">
        <span>Total income:</span>
        <span className="text-investment-gold font-bold">₹{totalIncome.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default ProductMetrics;
