
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAllUserTransactions } from '@/hooks/useAllUserTransactions';
import { formatDate } from '@/utils/dateUtils';

const AdminDepositsPanel: React.FC = () => {
  const { transactions } = useAllUserTransactions();
  
  // Filter only deposit transactions
  const deposits = transactions.filter(t => t.type === 'deposit');

  return (
    <Card className="bg-[#222B45]/80 border-[#33374D]">
      <CardHeader>
        <CardTitle className="text-white">Deposits Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-300">Transaction ID</TableHead>
                <TableHead className="text-gray-300">User</TableHead>
                <TableHead className="text-gray-300">Amount</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deposits.length > 0 ? (
                deposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell className="text-gray-300 font-mono">
                      {deposit.id.substring(0, 8)}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {deposit.userName}
                      <div className="text-xs text-gray-500">{deposit.userId}</div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      ₹{deposit.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {formatDate(deposit.timestamp)}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        deposit.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : deposit.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {deposit.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                    No deposits found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDepositsPanel;
