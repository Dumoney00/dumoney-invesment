
import { TransactionType } from '@/types/auth';
import { Download, LineChart, TrendingUp, Upload } from 'lucide-react';

export const getTransactionIcon = (type: TransactionType) => {
  switch (type) {
    case 'deposit':
      return Download;
    case 'withdraw':
      return Upload;
    case 'purchase':
      return TrendingUp;
    default:
      return LineChart;
  }
};

export const getTransactionIconClass = (type: TransactionType) => {
  switch (type) {
    case 'deposit':
      return 'bg-green-500/20 text-green-500';
    case 'withdraw':
      return 'bg-amber-500/20 text-amber-500';
    case 'purchase':
      return 'bg-purple-500/20 text-purple-500';
    default:
      return 'bg-blue-500/20 text-blue-500';
  }
};
