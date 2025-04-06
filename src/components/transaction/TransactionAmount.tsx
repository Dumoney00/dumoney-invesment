
import React from 'react';
import { TransactionType } from '@/types/auth';

interface TransactionAmountProps {
  amount: number;
  type: TransactionType;
}

const TransactionAmount: React.FC<TransactionAmountProps> = ({ amount, type }) => {
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

  const isNegative = type === "withdraw" || type === "purchase";
  
  return (
    <p className={`font-medium ${getTransactionColor(type)}`}>
      {isNegative ? "-" : "+"}
      ₹{amount}
    </p>
  );
};

export default TransactionAmount;
