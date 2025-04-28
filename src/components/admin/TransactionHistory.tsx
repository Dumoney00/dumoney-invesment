
import { useAllUserTransactions } from "@/hooks/useAllUserTransactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import TransactionStatus from "@/components/transaction/TransactionStatus";
import { formatCurrency } from "@/utils/formatUtils";

const TransactionHistory = () => {
  const { transactions, loading } = useAllUserTransactions();

  // Filter only deposits and withdrawals
  const filteredTransactions = transactions.filter(
    tx => tx.type === 'deposit' || tx.type === 'withdraw'
  );

  return (
    <Card className="bg-[#1A1F2C] border-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-xl">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
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
                  <TableCell className="font-medium">{transaction.userName}</TableCell>
                  <TableCell className="capitalize">{transaction.type}</TableCell>
                  <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                  <TableCell>
                    <TransactionStatus status={transaction.status} />
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
