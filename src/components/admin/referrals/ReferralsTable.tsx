
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatUtils';
import { ReferralRecord } from '@/types/referrals';

interface ReferralsTableProps {
  referrals: ReferralRecord[];
  selectedReferrals: string[];
  loading: boolean;
  isReferralOverdue: (date: string) => boolean;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onApprove: (id: string) => void;
  onReject: (referral: ReferralRecord) => void;
}

const ReferralsTable: React.FC<ReferralsTableProps> = ({
  referrals,
  selectedReferrals,
  loading,
  isReferralOverdue,
  onToggleSelect,
  onToggleSelectAll,
  onApprove,
  onReject,
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-[#1A1F2C]/50">
          <TableRow className="border-[#33374D] hover:bg-[#1A1F2C]/70">
            <TableHead className="text-gray-400 w-[30px]">
              <input 
                type="checkbox" 
                className="rounded bg-[#1A1F2C] border-[#33374D] text-[#8B5CF6]"
                onChange={onToggleSelectAll}
                checked={selectedReferrals.length > 0 && selectedReferrals.length === referrals.filter(r => r.status === 'pending').length}
              />
            </TableHead>
            <TableHead className="text-gray-400">Referral ID</TableHead>
            <TableHead className="text-gray-400">Referrer</TableHead>
            <TableHead className="text-gray-400">Referred User</TableHead>
            <TableHead className="text-gray-400">Date</TableHead>
            <TableHead className="text-gray-400">Status</TableHead>
            <TableHead className="text-gray-400 text-right">Bonus Amount</TableHead>
            <TableHead className="text-gray-400">Admin Notes</TableHead>
            <TableHead className="text-gray-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrals.map(referral => (
            <TableRow 
              key={referral.id} 
              className={`border-[#33374D] hover:bg-[#1A1F2C]/70 ${isReferralOverdue(referral.dateCreated) && referral.status === 'pending' ? 'bg-red-900/10' : ''}`}
            >
              <TableCell>
                {referral.status === 'pending' && (
                  <input 
                    type="checkbox" 
                    className="rounded bg-[#1A1F2C] border-[#33374D] text-[#8B5CF6]"
                    checked={selectedReferrals.includes(referral.id)}
                    onChange={() => onToggleSelect(referral.id)}
                  />
                )}
              </TableCell>
              <TableCell className="text-gray-300 font-mono">{referral.id}</TableCell>
              <TableCell className="text-gray-300">{referral.referrerName}</TableCell>
              <TableCell className="text-gray-300">{referral.referredName}</TableCell>
              <TableCell className="text-gray-300">
                {formatDate(referral.dateCreated)}
                {referral.status !== 'pending' && (
                  <div className="text-xs text-gray-500">
                    Updated: {formatDate(referral.dateUpdated)}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {referral.status === 'pending' && (
                  <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {isReferralOverdue(referral.dateCreated) ? 'Overdue' : 'Pending'}
                  </Badge>
                )}
                {referral.status === 'approved' && (
                  <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                    Approved
                  </Badge>
                )}
                {referral.status === 'rejected' && (
                  <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
                    Rejected
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right text-gray-300">
                {formatCurrency(referral.bonusAmount)}
              </TableCell>
              <TableCell className="text-gray-300 max-w-xs truncate">
                {referral.adminComment}
                {referral.adminName && (
                  <div className="text-xs text-gray-500">
                    By: {referral.adminName}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {referral.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                        onClick={() => onApprove(referral.id)}
                        disabled={loading}
                      >
                        <Check size={16} className="mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                        onClick={() => onReject(referral)}
                        disabled={loading}
                      >
                        <X size={16} className="mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          
          {referrals.length === 0 && (
            <TableRow className="border-[#33374D]">
              <TableCell colSpan={9} className="text-center py-8 text-gray-400">
                No referrals found matching your search criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReferralsTable;
