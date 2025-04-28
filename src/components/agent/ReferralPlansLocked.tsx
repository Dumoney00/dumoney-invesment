
import React from 'react';
import { Card } from '@/components/ui/card';
import { Lock, Users } from 'lucide-react';
import { ReferralTier } from '@/types/referrals';
import { formatCurrency } from '@/utils/formatUtils';

interface ReferralPlansLockedProps {
  tiers: ReferralTier[];
  userReferralCount?: number;
}

const ReferralPlansLocked: React.FC<ReferralPlansLockedProps> = ({ tiers, userReferralCount = 0 }) => {
  return (
    <div className="space-y-4 p-4">
      {tiers.map((tier) => {
        const isUnlocked = userReferralCount >= tier.minReferrals;
        const reward = tier.benefits[0].match(/₹(\d+,*\d*)/)?.[1] || '';
        
        return (
          <Card 
            key={tier.level}
            className="overflow-hidden bg-[#1A1F2C] border-0"
          >
            {/* Header */}
            <div className={`p-4 flex justify-between items-center ${
              isUnlocked ? 'bg-green-600' : 'bg-amber-600'
            }`}>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-white" />
                <h3 className="text-xl font-semibold text-white">
                  {`Plan ${tier.level === 'crown' ? '6' : 
                    tier.level === 'diamond' ? '5' : 
                    tier.level === 'platinum' ? '4' : 
                    tier.level === 'gold' ? '3' : 
                    tier.level === 'silver' ? '2' : '1'} ${!isUnlocked ? '(Locked)' : ''}`}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5" />
                <span className="text-lg">{tier.minReferrals} members</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div>
                <p className="text-gray-400 mb-2">Reward</p>
                <p className="text-[#F97316] text-4xl font-bold">₹{reward}</p>
              </div>

              {/* Unlock message */}
              <div className={`flex items-center gap-2 p-4 rounded-lg ${
                isUnlocked ? 'bg-green-900/20' : 'bg-slate-800'
              }`}>
                <Lock className="h-5 w-5 text-gray-400" />
                <p className="text-gray-400">
                  {isUnlocked 
                    ? 'Plan unlocked!' 
                    : `Unlock by reaching ${tier.minReferrals} team members`}
                </p>
              </div>

              {/* Additional benefit for crown tier */}
              {tier.benefits.length > 1 && (
                <div className="mt-4 p-4 bg-purple-900/20 rounded-lg">
                  <p className="text-purple-300">
                    + Monthly salary: {tier.benefits[1].split('Monthly salary ')[1]}
                  </p>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ReferralPlansLocked;
