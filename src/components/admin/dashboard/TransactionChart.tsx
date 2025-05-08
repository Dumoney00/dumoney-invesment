
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  date: string;
  deposits: number;
  withdrawals: number;
}

interface TransactionChartProps {
  chartData: ChartDataPoint[];
}

const TransactionChart: React.FC<TransactionChartProps> = ({ chartData }) => {
  return (
    <Card className="bg-[#191919] border-gray-800 mb-6">
      <CardHeader>
        <CardTitle>Transactions (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorWithdrawals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                stroke="#525252"
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
              />
              <YAxis stroke="#525252" />
              <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#191919', border: '1px solid #333' }}
                formatter={(value: number) => [`₹${value}`, undefined]}
                labelFormatter={(date: string) => new Date(date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
              />
              <Area 
                type="monotone" 
                dataKey="deposits" 
                name="Deposits" 
                stroke="#4ade80" 
                fillOpacity={1} 
                fill="url(#colorDeposits)" 
              />
              <Area 
                type="monotone" 
                dataKey="withdrawals" 
                name="Withdrawals" 
                stroke="#f59e0b" 
                fillOpacity={1} 
                fill="url(#colorWithdrawals)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionChart;
