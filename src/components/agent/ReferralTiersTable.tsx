
import React from 'react';
import { ReferralTier } from '@/types/referrals';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Award, Gift } from 'lucide-react';

interface ReferralTiersTableProps {
  tiers: ReferralTier[];
}

const ReferralTiersTable: React.FC<ReferralTiersTableProps> = ({ tiers }) => {
  return (
    <div className="bg-[#222222] border border-gray-700 rounded-lg overflow-hidden mt-6">
      <div className="p-4 border-b border-gray-700 flex items-center">
        <Award className="text-investment-gold mr-2" size={20} />
        <h3 className="text-lg font-bold text-white">Referral Rewards</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#1a1a1a]">
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300">Plan</TableHead>
              <TableHead className="text-gray-300">Referrals</TableHead>
              <TableHead className="text-gray-300">Bonus</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tiers.map((tier) => (
              <TableRow key={tier.level} className="border-gray-700">
                <TableCell className="font-medium">
                  <span className={`inline-block px-2 py-1 rounded ${tier.color}`}>
                    {tier.name}
                  </span>
                </TableCell>
                <TableCell>
                  {tier.maxReferrals ? 
                    `${tier.minReferrals}-${tier.maxReferrals}` : 
                    `${tier.minReferrals}+`}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Gift className="text-investment-gold mr-2" size={16} />
                    {tier.benefits.join(', ')}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReferralTiersTable;
