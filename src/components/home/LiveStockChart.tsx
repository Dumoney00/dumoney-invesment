
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for the chart
const data = [
  { name: 'Jan', value: 1000 },
  { name: 'Feb', value: 1200 },
  { name: 'Mar', value: 900 },
  { name: 'Apr', value: 1500 },
  { name: 'May', value: 1800 },
  { name: 'Jun', value: 1600 },
  { name: 'Jul', value: 2000 },
];

const LiveStockChart: React.FC = () => {
  return (
    <Card className="bg-[#222222] border-gray-800 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Live Market Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="name" 
                stroke="#777777" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#777777"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#333', 
                  border: 'none', 
                  borderRadius: '4px', 
                  color: 'white' 
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#FFD700" 
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveStockChart;
