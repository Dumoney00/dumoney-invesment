
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ChartLegend from './ChartLegend';
import ChartGradients from './chart/ChartGradients';
import ChartAreas from './chart/ChartAreas';
import { ChartDataPoint } from '@/utils/chartUtils';

interface ActivityChartProps {
  data?: ChartDataPoint[];
  timeRange?: 'weekly' | 'monthly';
  onTimeRangeChange?: (range: 'weekly' | 'monthly') => void;
}

// Sample data if none is provided
const sampleData = [
  { name: 'Mon', deposits: 4000, withdrawals: 2400, investments: 2400 },
  { name: 'Tue', deposits: 3000, withdrawals: 1398, investments: 2210 },
  { name: 'Wed', deposits: 2000, withdrawals: 9800, investments: 2290 },
  { name: 'Thu', deposits: 2780, withdrawals: 3908, investments: 2000 },
  { name: 'Fri', deposits: 1890, withdrawals: 4800, investments: 2181 },
  { name: 'Sat', deposits: 2390, withdrawals: 3800, investments: 2500 },
  { name: 'Sun', deposits: 3490, withdrawals: 4300, investments: 2100 },
];

const ActivityChart: React.FC<ActivityChartProps> = ({ 
  data = sampleData, 
  timeRange = 'weekly', 
  onTimeRangeChange = () => {} 
}) => {
  return (
    <Card className="bg-[#222B45]/80 border-[#33374D]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-white">Real-time Activity</CardTitle>
          <CardDescription className="text-gray-400">
            User transactions and activity over time
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button 
            onClick={() => onTimeRangeChange('weekly')}
            className={`px-3 py-1 rounded ${timeRange === 'weekly' ? 'bg-[#8B5CF6] text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Weekly
          </button>
          <button 
            onClick={() => onTimeRangeChange('monthly')}
            className={`px-3 py-1 rounded ${timeRange === 'monthly' ? 'bg-[#8B5CF6] text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Monthly
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <ChartGradients />
              <CartesianGrid strokeDasharray="3 3" stroke="#33374D" vertical={false} />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1F2C', 
                  borderColor: '#33374D',
                  color: '#fff'
                }}
              />
              <ChartAreas data={data} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <ChartLegend />
      </CardContent>
    </Card>
  );
};

export default ActivityChart;
