
import React from 'react';
import { Area } from 'recharts';
import { ChartDataPoint } from '@/utils/chartUtils';

interface ChartAreasProps {
  data?: ChartDataPoint[];
}

const ChartAreas: React.FC<ChartAreasProps> = ({ data = [] }) => {
  // Check if we have valid data with the required properties
  const hasValidData = data && data.length > 0 && 
    'deposits' in data[0] && 
    'withdrawals' in data[0] && 
    'purchases' in data[0];

  if (!hasValidData) {
    return null; // Don't render areas if data is invalid
  }

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
