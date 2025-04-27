
import React from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { formatCurrency } from '@/utils/chartUtils';

interface ChartAreasProps {
  data: Array<{
    date: string;
    value: number;
  }>;
  height?: number;
  colors?: {
    stroke: string;
    fill: string;
  };
}

const ChartAreas: React.FC<ChartAreasProps> = ({
  data,
  height = 300,
  colors = {
    stroke: '#8B5CF6',
    fill: 'url(#colorGradient)'
  }
}) => {
  // Safety check to prevent issues with undefined data
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-64 text-gray-400">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.stroke} stopOpacity={0.8} />
            <stop offset="95%" stopColor={colors.stroke} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#9CA3AF' }}
          tickLine={{ stroke: '#4B5563' }}
          axisLine={{ stroke: '#4B5563' }}
        />
        <YAxis
          tick={{ fill: '#9CA3AF' }}
          tickLine={{ stroke: '#4B5563' }}
          axisLine={{ stroke: '#4B5563' }}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), 'Amount']}
          labelFormatter={(label) => `Date: ${label}`}
          contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.375rem' }}
          itemStyle={{ color: '#E5E7EB' }}
          labelStyle={{ color: '#9CA3AF' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={colors.stroke}
          fill={colors.fill}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ChartAreas;
