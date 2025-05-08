
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from 'date-fns';
import { TransactionSummary } from "@/types/admin";

interface UserStatsTableProps {
  stats: TransactionSummary[];
}

export const UserStatsTable: React.FC<UserStatsTableProps> = ({ stats }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredStats = stats.filter(stat => 
    stat.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stat.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (stats.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No user statistics available.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Search by username or email"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">User</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Deposits</TableHead>
              <TableHead className="text-gray-300">Withdrawals</TableHead>
              <TableHead className="text-gray-300">Total Txns</TableHead>
              <TableHead className="text-gray-300">Last Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStats.map((stat) => (
              <TableRow 
                key={stat.user_id}
                className="border-gray-800 hover:bg-gray-900/50"
              >
                <TableCell className="font-medium text-white">
                  {stat.username || 'Unknown'}
                </TableCell>
                <TableCell className="text-gray-300">
                  {stat.email}
                </TableCell>
                <TableCell className="font-mono text-green-500">
                  ₹{stat.total_deposits.toLocaleString('en-IN')} <span className="text-gray-500 text-xs">({stat.deposit_count})</span>
                </TableCell>
                <TableCell className="font-mono text-amber-500">
                  ₹{stat.total_withdrawals.toLocaleString('en-IN')} <span className="text-gray-500 text-xs">({stat.withdrawal_count})</span>
                </TableCell>
                <TableCell className="text-gray-300">
                  {stat.deposit_count + stat.withdrawal_count}
                </TableCell>
                <TableCell className="text-gray-400">
                  {stat.last_transaction_date ? 
                    formatDistanceToNow(new Date(stat.last_transaction_date), { addSuffix: true }) :
                    'No activity'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
