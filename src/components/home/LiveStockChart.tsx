
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChartAreas from '@/components/admin/activity/chart/ChartAreas';
import { ChartDataPoint, generateChartData } from '@/utils/chartUtils';
import { TrendingUp, TrendingDown } from 'lucide-react';

const LiveStockChart: React.FC = () => {
  const [data, setData] = useState<ChartDataPoint[]>(generateChartData(20));
  const [trend, setTrend] = useState<'up' | 'down'>('up');

  useEffect(() => {
    const interval = setInterval(() => {
      setData(currentData => {
        const newData = [...currentData];
        // Remove oldest point
        newData.shift();
        
        // Add new point with random fluctuation
        const lastValue = newData[newData.length - 1].value;
        const randomChange = Math.random() * 10 - 5; // Random value between -5 and 5
        const newValue = Math.max(0, lastValue + randomChange);
        
        const now = new Date();
        newData.push({
          date: now.toISOString().substring(0, 10),
          value: newValue
        });

        // Update trend
        setTrend(newValue > lastValue ? 'up' : 'down');
        
        return newData;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-[#222222] border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          Live Market
          {trend === 'up' ? (
            <TrendingUp className="text-green-500" size={20} />
          ) : (
            <TrendingDown className="text-red-500" size={20} />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ChartAreas 
            data={data}
            height={200}
            colors={{
              stroke: trend === 'up' ? '#22c55e' : '#ef4444',
              fill: trend === 'up' ? 'url(#greenGradient)' : 'url(#redGradient)'
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveStockChart;
