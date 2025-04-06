
import React from 'react';

interface TransactionStatusProps {
  status: "completed" | "pending" | "failed";
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({ status }) => {
  const getStatusClasses = () => {
    switch (status) {
      case "completed":
        return "bg-green-900/20 text-green-400";
      case "pending":
        return "bg-yellow-900/20 text-yellow-400";
      case "failed":
        return "bg-red-900/20 text-red-400";
      default:
        return "bg-gray-900/20 text-gray-400";
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClasses()}`}>
      {status}
    </span>
  );
};

export default TransactionStatus;
