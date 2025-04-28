
import React, { useState } from 'react';
import { TransactionRecord } from '@/types/auth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatDate } from '@/utils/dateUtils';
import { CheckCircle, XCircle, Clock, Check } from 'lucide-react';

interface WithdrawalsListProps {
  withdrawals: TransactionRecord[];
}

const WithdrawalsList: React.FC<WithdrawalsListProps> = ({ withdrawals }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  
  // Filter withdrawals based on search and status
  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = 
      withdrawal.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || withdrawal.status === statusFilter;
    
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
  
  const handleApproveWithdrawal = (withdrawalId: string) => {
    // In a real implementation, this would call an API to approve the withdrawal
    console.log('Approving withdrawal:', withdrawalId);
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
              <TableHead className="text-gray-400">Bank Details</TableHead>
              <TableHead className="text-gray-400">Date</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWithdrawals.length > 0 ? (
              filteredWithdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id} className="border-[#33374D] hover:bg-[#1A1F2C]/70">
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
                    <div className="flex items-center gap-2">
                      {getStatusIcon(withdrawal.status)}
                      <span className={`px-2 py-1 rounded text-xs ${
                        withdrawal.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : withdrawal.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {withdrawal.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {withdrawal.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                        onClick={() => handleApproveWithdrawal(withdrawal.id)}
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
    </div>
  );
};

export default WithdrawalsList;
