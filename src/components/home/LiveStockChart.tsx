
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
        newData.shift();
        
        const lastValue = newData[newData.length - 1].value;
        const randomChange = Math.random() * 10 - 5;
        const newValue = Math.max(0, lastValue + randomChange);
        
        const now = new Date();
        newData.push({
          date: now.toISOString().substring(0, 10),
          value: newValue
        });

        setTrend(newValue > lastValue ? 'up' : 'down');
        
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-[#1A1F2C] to-[#222B45] border-none shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white/90 font-medium flex items-center gap-2">
          Market Trend
          {trend === 'up' ? (
            <TrendingUp className="text-emerald-400" size={20} />
          ) : (
            <TrendingDown className="text-rose-400" size={20} />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ChartAreas 
            data={data}
            height={200}
            colors={{
              stroke: trend === 'up' ? '#10B981' : '#F43F5E',
              fill: trend === 'up' ? 'url(#greenGradient)' : 'url(#redGradient)'
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveStockChart;
