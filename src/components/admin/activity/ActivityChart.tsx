
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { generateChartData } from '@/utils/chartUtils';
import ChartLegend from './ChartLegend';

interface ActivityChartProps {
  data: any[];
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ 
  data, 
  timeRange, 
  onTimeRangeChange 
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
              <defs>
                <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorWithdrawals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <ChartLegend />
      </CardContent>
    </Card>
  );
};

export default ActivityChart;
