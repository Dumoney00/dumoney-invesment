
import { TransactionRecord } from '@/types/auth';

export interface ChartDataPoint {
  name: string;
  deposits: number;
  withdrawals: number;
  purchases: number;
}

export const generateChartData = (transactions: TransactionRecord[], days: number = 7): ChartDataPoint[] => {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    const dayTransactions = transactions.filter(t => 
      new Date(t.timestamp).toDateString() === date.toDateString()
    );

    data.push({
      name: dateStr,
      deposits: dayTransactions.filter(t => t.type === 'deposit').length,
      withdrawals: dayTransactions.filter(t => t.type === 'withdraw').length,
      purchases: dayTransactions.filter(t => t.type === 'purchase').length
    });
  }
  return data;
};
