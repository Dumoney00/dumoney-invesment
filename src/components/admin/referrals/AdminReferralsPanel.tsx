
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Check, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReferralData {
  userId: string;
  username: string;
  level: number;
  referredCount: number;
  activeReferrals: number;
  pendingBonus: number;
  totalBonus: number;
  activeSince: string;
}

// Mock referral data for development
const mockReferrals: ReferralData[] = [
  {
    userId: 'usr_123',
    username: 'john_doe',
    level: 2,
    referredCount: 5,
    activeReferrals: 3,
    pendingBonus: 150,
    totalBonus: 850,
    activeSince: '2023-10-15T10:30:00Z'
  },
  {
    userId: 'usr_456',
    username: 'jane_smith',
    level: 1,
    referredCount: 2,
    activeReferrals: 1,
    pendingBonus: 50,
    totalBonus: 200,
    activeSince: '2023-12-05T14:20:00Z'
  },
  {
    userId: 'usr_789',
    username: 'robert_johnson',
    level: 3,
    referredCount: 12,
    activeReferrals: 8,
    pendingBonus: 500,
    totalBonus: 3200,
    activeSince: '2023-05-22T09:45:00Z'
  },
  {
    userId: 'usr_101',
    username: 'sarah_wilson',
    level: 2,
    referredCount: 4,
    activeReferrals: 3,
    pendingBonus: 120,
    totalBonus: 780,
    activeSince: '2023-11-18T16:30:00Z'
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

  // Calculate total statistics for the summary cards
  const totalAgents = referrals.length;
  const totalReferred = referrals.reduce((sum, r) => sum + r.referredCount, 0);
  const totalActiveReferrals = referrals.reduce((sum, r) => sum + r.activeReferrals, 0);
  const totalPendingBonus = referrals.reduce((sum, r) => sum + r.pendingBonus, 0);
  const totalBonusPaid = referrals.reduce((sum, r) => sum + r.totalBonus, 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#222B45]/80 border-[#33374D]">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Agents</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{totalAgents}</h3>
              </div>
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Users size={24} className="text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#222B45]/80 border-[#33374D]">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Referrals</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{totalReferred}</h3>
                <p className="text-xs text-gray-500">{totalActiveReferrals} active referrals</p>
              </div>
              <div className="bg-green-500/20 p-2 rounded-lg">
                <Users size={24} className="text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#222B45]/80 border-[#33374D]">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending Bonus</p>
                <h3 className="text-2xl font-bold mt-1 text-white">₹{totalPendingBonus.toLocaleString()}</h3>
              </div>
              <div className="bg-amber-500/20 p-2 rounded-lg">
                <Check size={24} className="text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#222B45]/80 border-[#33374D]">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Bonus Paid</p>
                <h3 className="text-2xl font-bold mt-1 text-white">₹{totalBonusPaid.toLocaleString()}</h3>
              </div>
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <TrendingUp size={24} className="text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referrals Table */}
      <Card className="bg-[#222B45]/80 border-[#33374D]">
        <CardHeader className="pb-3">
          <CardTitle className="text-white">Referral Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-6">
            <div className="relative w-full md:w-64">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search agents..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-[#1A1F2C] border-[#33374D] text-white pl-10"
              />
            </div>
          </div>

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
                {filteredReferrals.map(referral => (
                  <TableRow key={referral.userId} className="border-[#33374D] hover:bg-[#1A1F2C]/70">
                    <TableCell className="text-gray-300 font-mono">{referral.userId.substring(0, 8)}</TableCell>
                    <TableCell className="text-gray-300">{referral.username}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        referral.level === 1 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                        referral.level === 2 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}>
                        Level {referral.level}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-300">{referral.referredCount}</TableCell>
                    <TableCell className="text-gray-300">{referral.activeReferrals}</TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(referral.activeSince).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right text-gray-300">
                      ₹{referral.pendingBonus.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-gray-300">
                      ₹{referral.totalBonus.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
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
                  <TableRow className="border-[#33374D]">
                    <TableCell colSpan={9} className="text-center py-8 text-gray-400">
                      No agents found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReferralsPanel;
