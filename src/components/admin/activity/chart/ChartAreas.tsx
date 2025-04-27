
import React from 'react';
import { Area } from 'recharts';

interface ChartAreaData {
  deposits: number;
  withdrawals: number;
  purchases: number;
}

const ChartAreas: React.FC = () => {
  return (
    <>
      <Area 
        type="monotone" 
        dataKey="deposits" 
        stroke="#4CAF50" 
        fillOpacity={1} 
        fill="url(#colorDeposits)" 
      />
      <Area
        type="monotone" 
        dataKey="withdrawals" 
        stroke="#F97316" 
        fillOpacity={1} 
        fill="url(#colorWithdrawals)" 
      />
      <Area
        type="monotone" 
        dataKey="purchases" 
        stroke="#8B5CF6" 
        fillOpacity={1} 
        fill="url(#colorPurchases)" 
      />
    </>
  );
};

export default ChartAreas;
