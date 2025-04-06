
import React from 'react';
import { TransactionType } from '@/types/auth';

interface TransactionTypeLabelProps {
  type: TransactionType;
}

const TransactionTypeLabel: React.FC<TransactionTypeLabelProps> = ({ type }) => {
  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case "deposit":
        return "text-green-400";
      case "withdraw":
        return "text-red-400";
      case "purchase":
        return "text-blue-400";
      case "sale":
        return "text-purple-400";
      case "dailyIncome":
        return "text-investment-gold";
      default:
        return "text-white";
    }
  };

  return (
    <p className={`font-medium capitalize ${getTransactionColor(type)}`}>
      {type}
    </p>
  );
};

export default TransactionTypeLabel;
