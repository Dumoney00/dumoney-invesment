
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, AlertTriangle, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { UserReferralStats, ReferralRecord } from '@/types/referrals';

interface ReferralDashboardStatsProps {
  userStats: UserReferralStats[];
  referrals: ReferralRecord[];
  isReferralOverdue: (date: string) => boolean;
}

const ReferralDashboardStats: React.FC<ReferralDashboardStatsProps> = ({
  userStats,
  referrals,
  isReferralOverdue
}) => {
  const totalAgents = userStats.length;
  const totalReferred = userStats.reduce((sum, r) => sum + r.totalReferrals, 0);
  const totalActiveReferrals = userStats.reduce((sum, r) => sum + r.approvedReferrals, 0);
  const totalPendingBonus = userStats.reduce((sum, r) => sum + r.pendingBonus, 0);
  const totalBonusPaid = userStats.reduce((sum, r) => sum + r.totalBonus, 0);
  const pendingReferralCount = referrals.filter(r => r.status === 'pending').length;
  const overdueReferralCount = referrals.filter(r => 
    r.status === 'pending' && isReferralOverdue(r.dateCreated)
  ).length;

  return (
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
              <p className="text-xs text-gray-500">{totalActiveReferrals} approved referrals</p>
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
              <h3 className="text-2xl font-bold mt-1 text-white">{formatCurrency(totalPendingBonus)}</h3>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                  {pendingReferralCount} pending
                </Badge>
                {overdueReferralCount > 0 && (
                  <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30 ml-2">
                    {overdueReferralCount} overdue
                  </Badge>
                )}
              </div>
            </div>
            <div className="bg-amber-500/20 p-2 rounded-lg">
              <AlertTriangle size={24} className="text-amber-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-[#222B45]/80 border-[#33374D]">
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Bonus Paid</p>
              <h3 className="text-2xl font-bold mt-1 text-white">{formatCurrency(totalBonusPaid)}</h3>
            </div>
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <TrendingUp size={24} className="text-purple-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralDashboardStats;
