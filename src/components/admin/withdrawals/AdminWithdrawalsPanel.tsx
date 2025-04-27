
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAllUserTransactions } from '@/hooks/useAllUserTransactions';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/utils/dateUtils';

const AdminWithdrawalsPanel: React.FC = () => {
  const { transactions } = useAllUserTransactions();
  const { user } = useAuth();
  
  // Filter only withdrawal transactions
  const withdrawals = transactions.filter(t => t.type === 'withdraw');

  return (
    <Card className="bg-[#222B45]/80 border-[#33374D]">
      <CardHeader>
        <CardTitle className="text-white">Withdrawals Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-300">Transaction ID</TableHead>
                <TableHead className="text-gray-300">User</TableHead>
                <TableHead className="text-gray-300">Amount</TableHead>
                <TableHead className="text-gray-300">Bank Details</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.length > 0 ? (
                withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell className="text-gray-300 font-mono">
                      {withdrawal.id.substring(0, 8)}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {withdrawal.userName}
                      <div className="text-xs text-gray-500">{withdrawal.userId}</div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      ₹{withdrawal.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {withdrawal.bankDetails ? (
                        <div className="space-y-1">
                          <div>{withdrawal.bankDetails.accountHolderName}</div>
                          <div className="text-xs text-gray-400">
                            AC: {withdrawal.bankDetails.accountNumber}
                          </div>
                          <div className="text-xs text-gray-400">
                            IFSC: {withdrawal.bankDetails.ifscCode}
                          </div>
                        </div>
                      ) : withdrawal.upiId ? (
                        <div className="text-xs">UPI: {withdrawal.upiId}</div>
                      ) : 'No details'}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {formatDate(withdrawal.timestamp)}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        withdrawal.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : withdrawal.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {withdrawal.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {withdrawal.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                        >
                          <Check size={16} className="mr-1" />
                          Approve
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                    No withdrawals found
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

export default AdminWithdrawalsPanel;
