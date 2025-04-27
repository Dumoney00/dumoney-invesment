
import React from 'react';

const ChartLegend = () => {
  return (
    <div className="flex items-center justify-center space-x-8 pt-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#4CAF50]"></div>
        <span className="text-sm text-gray-400">Deposits</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
        <span className="text-sm text-gray-400">Withdrawals</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#8B5CF6]"></div>
        <span className="text-sm text-gray-400">Purchases</span>
      </div>
    </div>
  );
};

export default ChartLegend;
