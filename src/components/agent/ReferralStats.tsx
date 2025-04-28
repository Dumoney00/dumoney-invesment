
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserCheck, Clock, TrendingUp } from 'lucide-react';
import { ReferralRecord, ReferralTier } from '@/types/referrals';

interface ReferralStatsProps {
  userTier: ReferralTier;
  userReferrals: ReferralRecord[];
  approvedCount: number;
  pendingCount: number;
  earnedBonus: number;
}

const ReferralStats: React.FC<ReferralStatsProps> = ({
  userTier,
  userReferrals,
  approvedCount,
  pendingCount,
  earnedBonus
}) => {
  const totalCount = userReferrals.length;

  return (
    <Card className="bg-[#222222] border-gray-700 overflow-hidden mb-6">
      <div className="h-2 bg-gradient-to-r from-investment-gold to-yellow-500"></div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Badge className={`mr-2 ${userTier.color}`}>
              {userTier.name}
            </Badge> 
            Agent Status
          </h2>
          <Badge variant="outline" className="bg-[#333333] text-gray-300 border-gray-700">
            {userTier.bonusPercentage}% Bonus Rate
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <StatsCard
            icon={<Users size={20} className="text-blue-400 mb-2" />}
            value={totalCount}
            label="Total Referrals"
          />
          <StatsCard
            icon={<UserCheck size={20} className="text-green-400 mb-2" />}
            value={approvedCount}
            label="Approved"
          />
          <StatsCard
            icon={<Clock size={20} className="text-amber-400 mb-2" />}
            value={pendingCount}
            label="Pending"
          />
          <StatsCard
            icon={<TrendingUp size={20} className="text-purple-400 mb-2" />}
            value={earnedBonus}
            label="Total Earned"
            isCurrency
          />
        </div>

        <div className="flex gap-2 mb-2">
          {userTier.benefits.map((benefit, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="bg-[#333333] text-gray-300 border-gray-700"
            >
              {benefit}
            </Badge>
          ))}
        </div>
        
        {userTier.level !== 'gold' && (
          <div className="text-sm text-gray-400 mt-2">
            {approvedCount} / 50 approved referrals to reach Gold
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface StatsCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  isCurrency?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, value, label, isCurrency }) => (
  <div className="bg-[#333333] rounded-lg p-4 flex flex-col items-center">
    {icon}
    <p className="text-xl font-bold text-white">
      {isCurrency ? `₹${value.toLocaleString()}` : value}
    </p>
    <p className="text-xs text-gray-400">{label}</p>
  </div>
);

export default ReferralStats;
