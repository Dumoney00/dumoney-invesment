
import React, { useState } from 'react';
import { TransactionRecord } from '@/types/auth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from '@/utils/dateUtils';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface DepositsListProps {
  deposits: TransactionRecord[];
}

const DepositsList: React.FC<DepositsListProps> = ({ deposits }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  
  // Filter deposits based on search and status
  const filteredDeposits = deposits.filter(deposit => {
    const matchesSearch = 
      deposit.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || deposit.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'pending':
        return <Clock size={16} className="text-amber-400" />;
      case 'failed':
        return <XCircle size={16} className="text-red-400" />;
      default:
        return null;
    }
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <Input
          placeholder="Search by user or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[#1A1F2C]/50 border-[#33374D] text-white"
        />
        
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="bg-[#1A1F2C]/50 border-[#33374D] text-white md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1F2C] border-[#33374D] text-white">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#1A1F2C]/50">
            <TableRow className="border-[#33374D] hover:bg-[#1A1F2C]/70">
              <TableHead className="text-gray-400">Transaction ID</TableHead>
              <TableHead className="text-gray-400">User</TableHead>
              <TableHead className="text-gray-400">Amount</TableHead>
              <TableHead className="text-gray-400">Date</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeposits.length > 0 ? (
              filteredDeposits.map((deposit) => (
                <TableRow key={deposit.id} className="border-[#33374D] hover:bg-[#1A1F2C]/70">
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
                    <div className="flex items-center gap-2">
                      {getStatusIcon(deposit.status)}
                      <span className={`px-2 py-1 rounded text-xs ${
                        deposit.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : deposit.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {deposit.status}
                      </span>
                    </div>
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
    </div>
  );
};

export default DepositsList;
