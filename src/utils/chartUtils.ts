
import { TransactionRecord } from '@/types/auth';

export interface ChartDataPoint {
  name: string;
  deposits: number;
  withdrawals: number;
  purchases: number;
}

export const generateChartData = (transactions: TransactionRecord[], days: number = 7): ChartDataPoint[] => {
  // Initialize data array with default values for each day
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    // Get transactions for this day
    const dayTransactions = transactions?.filter(t => 
      t && t.timestamp && new Date(t.timestamp).toDateString() === date.toDateString()
    ) || [];

    // Add data point with counts, ensuring we have valid numbers
    data.push({
      name: dateStr,
      deposits: dayTransactions.filter(t => t.type === 'deposit').length || 0,
      withdrawals: dayTransactions.filter(t => t.type === 'withdraw').length || 0,
      purchases: dayTransactions.filter(t => t.type === 'purchase').length || 0
    });
  }
  return data;
};
