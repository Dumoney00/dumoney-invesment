
import { useAllUserTransactions } from "@/hooks/useAllUserTransactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import TransactionStatus from "@/components/transaction/TransactionStatus";
import { formatCurrency } from "@/utils/formatUtils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { User } from "@/types/auth";

const TransactionHistory = () => {
  const { transactions, loading, users } = useAllUserTransactions();
  const [transactionType, setTransactionType] = useState<'all' | 'deposit' | 'withdraw'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Filter transactions based on selected type
  const filteredTransactions = transactions.filter(tx => {
    if (transactionType === 'all') {
      return true;
    }
    return tx.type === transactionType;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          variant={transactionType === 'all' ? "default" : "outline"}
          onClick={() => setTransactionType('all')}
          className="bg-gray-800 text-white hover:bg-gray-700"
        >
          All Transactions
        </Button>
        <Button 
          variant={transactionType === 'deposit' ? "default" : "outline"}
          onClick={() => setTransactionType('deposit')}
          className="bg-green-800 text-white hover:bg-green-700"
        >
          Deposits
        </Button>
        <Button 
          variant={transactionType === 'withdraw' ? "default" : "outline"}
          onClick={() => setTransactionType('withdraw')}
          className="bg-red-800 text-white hover:bg-red-700"
        >
          Withdrawals
        </Button>
      </div>

      <Card className="bg-[#1A1F2C] border-gray-800 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Transaction History</CardTitle>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="bg-gray-800 hover:bg-gray-700">
                View All Users
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#1A1F2C] text-white border-l border-gray-800">
              <SheetHeader>
                <SheetTitle className="text-white">Registered Users</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2 max-h-[80vh] overflow-y-auto">
                {users.length === 0 ? (
                  <p className="text-gray-400">No users found</p>
                ) : (
                  users.map((user) => (
                    <div 
                      key={user.id} 
                      className="p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer"
                      onClick={() => setSelectedUser(user)}
                    >
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs bg-blue-900 px-2 py-1 rounded">
                          Balance: {formatCurrency(user.balance)}
                        </span>
                        <span className="text-xs bg-green-900 px-2 py-1 rounded">
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>
        </CardHeader>
        <CardContent>
          {selectedUser && (
            <div className="mb-4 p-4 bg-gray-800 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.username}</h3>
                  <p className="text-sm text-gray-400">{selectedUser.email}</p>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-white"
                >
                  Clear
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-gray-700 p-2 rounded">
                  <p className="text-xs text-gray-400">Balance</p>
                  <p className="font-medium">{formatCurrency(selectedUser.balance)}</p>
                </div>
                <div className="bg-gray-700 p-2 rounded">
                  <p className="text-xs text-gray-400">Total Deposits</p>
                  <p className="font-medium">{formatCurrency(selectedUser.totalDeposit)}</p>
                </div>
                <div className="bg-gray-700 p-2 rounded">
                  <p className="text-xs text-gray-400">Total Withdrawals</p>
                  <p className="font-medium">{formatCurrency(selectedUser.totalWithdraw)}</p>
                </div>
                <div className="bg-gray-700 p-2 rounded">
                  <p className="text-xs text-gray-400">Investments</p>
                  <p className="font-medium">{selectedUser.investmentQuantity}</p>
                </div>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-400">User</TableHead>
                <TableHead className="text-gray-400">Type</TableHead>
                <TableHead className="text-gray-400">Amount</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-gray-800">
                    <TableCell className="font-medium">{transaction.userName || 'Unknown'}</TableCell>
                    <TableCell className="capitalize">{transaction.type}</TableCell>
                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>
                      <TransactionStatus status={transaction.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.timestamp).toLocaleDateString()} {new Date(transaction.timestamp).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistory;
