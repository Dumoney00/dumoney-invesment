
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";

type TransactionType = "deposit" | "withdraw" | "purchase" | "sale" | "dailyIncome";

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  details?: string;
}

const TransactionHistory: React.FC = () => {
  const { user } = useAuth();
  
  // Get actual transactions from user if available
  const transactions = user?.transactions || [];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
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
    <div className="rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-300">Type</TableHead>
            <TableHead className="text-gray-300 text-right">Amount</TableHead>
            <TableHead className="text-gray-300 hidden md:table-cell">Date</TableHead>
            <TableHead className="text-gray-300 hidden md:table-cell">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} className="border-gray-700">
              <TableCell>
                <div>
                  <p className={`font-medium capitalize ${getTransactionColor(transaction.type)}`}>
                    {transaction.type}
                  </p>
                  <p className="text-xs text-gray-400 md:hidden">{formatDate(transaction.timestamp)}</p>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div>
                  <p className={`font-medium ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === "withdraw" || transaction.type === "purchase" ? "-" : "+"}
                    ₹{transaction.amount}
                  </p>
                  <p className="text-xs text-gray-400 md:hidden">{transaction.status}</p>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-gray-300">
                {formatDate(transaction.timestamp)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  transaction.status === "completed" ? "bg-green-900/20 text-green-400" : 
                  transaction.status === "pending" ? "bg-yellow-900/20 text-yellow-400" : 
                  "bg-red-900/20 text-red-400"
                }`}>
                  {transaction.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
          
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-10 text-gray-400">
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionHistory;
