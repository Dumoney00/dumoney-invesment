
import React from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { formatCurrency } from '@/utils/chartUtils';
import { ChartDataPoint } from '@/utils/chartUtils';

interface ChartAreasProps {
  data: ChartDataPoint[];
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
    stroke: '#10B981',
    fill: 'url(#greenGradient)'
  }
}) => {
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
          <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false} 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth={0.5}
        />
        <XAxis
          dataKey="date"
          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
          tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          dy={10}
        />
        <YAxis
          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
          tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          tickFormatter={(value) => formatCurrency(value)}
          dx={-10}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: 'rgba(17,24,39,0.9)', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(8px)'
          }}
          itemStyle={{ color: 'rgba(255,255,255,0.8)' }}
          labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
          formatter={(value: number) => [formatCurrency(value), 'Value']}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={colors.stroke}
          strokeWidth={2}
          fill={colors.fill}
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ChartAreas;
