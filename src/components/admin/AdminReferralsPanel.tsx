
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface ReferralData {
  userId: string;
  username: string;
  level: number;
  referredCount: number;
  activeReferrals: number;
  pendingBonus: number;
}

// Mock referral data for development
const mockReferrals: ReferralData[] = [
  {
    userId: 'usr_123',
    username: 'john_doe',
    level: 2,
    referredCount: 5,
    activeReferrals: 3,
    pendingBonus: 150
  },
  {
    userId: 'usr_456',
    username: 'jane_smith',
    level: 1,
    referredCount: 2,
    activeReferrals: 1,
    pendingBonus: 50
  },
  {
    userId: 'usr_789',
    username: 'robert_johnson',
    level: 3,
    referredCount: 12,
    activeReferrals: 8,
    pendingBonus: 500
  }
];

const AdminReferralsPanel: React.FC = () => {
  const { approveReferralBonus } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [referrals] = useState<ReferralData[]>(mockReferrals);
  const [loading, setLoading] = useState(false);

  // Filter referrals based on search term
  const filteredReferrals = referrals.filter(referral => 
    referral.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    referral.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproveBonus = async (userId: string, amount: number) => {
    setLoading(true);
    try {
      await approveReferralBonus(userId, amount);
      // In a real app, you'd update the UI state here after successful approval
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#222222] rounded-lg p-4">
      <div className="flex items-center gap-3 mb-6">
        <Input
          placeholder="Search agents by name or ID"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-[#333333] border-gray-700 text-white"
        />
        <Button variant="ghost" className="text-gray-400">
          <Search size={18} />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">Agent ID</TableHead>
              <TableHead className="text-gray-300">Username</TableHead>
              <TableHead className="text-gray-300">Level</TableHead>
              <TableHead className="text-gray-300">Total Referrals</TableHead>
              <TableHead className="text-gray-300">Active Referrals</TableHead>
              <TableHead className="text-gray-300 text-right">Pending Bonus</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReferrals.map(referral => (
              <TableRow key={referral.userId}>
                <TableCell className="text-white font-mono">{referral.userId.substring(0, 8)}</TableCell>
                <TableCell className="text-white">{referral.username}</TableCell>
                <TableCell className="text-white">
                  <span className="px-2 py-1 bg-yellow-900 text-yellow-200 rounded text-xs">
                    Level {referral.level}
                  </span>
                </TableCell>
                <TableCell className="text-white">{referral.referredCount}</TableCell>
                <TableCell className="text-white">{referral.activeReferrals}</TableCell>
                <TableCell className="text-right text-white">
                  ${referral.pendingBonus.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-900 border-green-700 text-white hover:bg-green-800"
                    onClick={() => handleApproveBonus(referral.userId, referral.pendingBonus)}
                    disabled={loading || referral.pendingBonus <= 0}
                  >
                    <Check size={16} className="mr-1" />
                    Approve
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredReferrals.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                  No agents found matching your search criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminReferralsPanel;
