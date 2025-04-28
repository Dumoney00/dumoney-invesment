
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/utils/formatUtils';
import { UserReferralStats } from '@/types/referrals';

interface AgentsTableProps {
  users: UserReferralStats[];
}

const AgentsTable: React.FC<AgentsTableProps> = ({ users }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-[#1A1F2C]/50">
          <TableRow className="border-[#33374D] hover:bg-[#1A1F2C]/70">
            <TableHead className="text-gray-400">Agent ID</TableHead>
            <TableHead className="text-gray-400">Username</TableHead>
            <TableHead className="text-gray-400">Level</TableHead>
            <TableHead className="text-gray-400">Total Referrals</TableHead>
            <TableHead className="text-gray-400">Active Referrals</TableHead>
            <TableHead className="text-gray-400">Active Since</TableHead>
            <TableHead className="text-gray-400 text-right">Pending Bonus</TableHead>
            <TableHead className="text-gray-400 text-right">Total Earned</TableHead>
            <TableHead className="text-gray-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.userId} className="border-[#33374D] hover:bg-[#1A1F2C]/70">
              <TableCell className="text-gray-300 font-mono">{user.userId.substring(0, 8)}</TableCell>
              <TableCell className="text-gray-300">{user.username}</TableCell>
              <TableCell>
                {user.level === 'bronze' && (
                  <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Bronze
                  </Badge>
                )}
                {user.level === 'silver' && (
                  <Badge className="bg-gray-400/20 text-gray-300 border border-gray-400/30">
                    Silver
                  </Badge>
                )}
                {user.level === 'gold' && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    Gold
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-gray-300">{user.totalReferrals}</TableCell>
              <TableCell className="text-gray-300">{user.approvedReferrals}</TableCell>
              <TableCell className="text-gray-300">{formatDate(user.activeSince)}</TableCell>
              <TableCell className="text-right text-gray-300">
                {formatCurrency(user.pendingBonus)}
              </TableCell>
              <TableCell className="text-right text-gray-300">
                {formatCurrency(user.totalBonus)}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                  onClick={() => {/* Navigate to agent details */}}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
          
          {users.length === 0 && (
            <TableRow className="border-[#33374D]">
              <TableCell colSpan={9} className="text-center py-8 text-gray-400">
                No agents found matching your search criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AgentsTable;
