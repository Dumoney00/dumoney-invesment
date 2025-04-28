import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useAuth } from '@/contexts/AuthContext';
import AgentHeader from '@/components/agent/AgentHeader';
import ReferralStats from '@/components/agent/ReferralStats';
import ReferralCode from '@/components/agent/ReferralCode';
import ReferralShare from '@/components/agent/ReferralShare';
import ReferralPlansLocked from '@/components/agent/ReferralPlansLocked';
import { 
  getUserReferralTier,
  referralTiers,
  fetchUserReferrals
} from '@/services/referralService';

const Agent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  const { data: userReferrals = [], isLoading } = useQuery({
    queryKey: ['userReferrals', user?.id],
    queryFn: () => fetchUserReferrals(user?.id || ''),
    enabled: isAuthenticated && !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const approvedCount = userReferrals.filter(r => r.status === 'approved').length;
  const pendingCount = userReferrals.filter(r => r.status === 'pending').length;
  const earnedBonus = userReferrals
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.bonusAmount, 0);

  const userTier = isAuthenticated && user 
    ? getUserReferralTier(approvedCount)
    : referralTiers[0];

  const handleCopyCode = () => {
    if (user) {
      const codeComponent = document.querySelector<HTMLButtonElement>('.copy-code-button');
      if (codeComponent) {
        codeComponent.click();
      }
    }
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      <AgentHeader />
      
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-gray-400">Loading referral data...</div>
          </div>
        ) : (
          <>
            <ReferralStats
              userTier={userTier}
              userReferrals={userReferrals}
              approvedCount={approvedCount}
              pendingCount={pendingCount}
              earnedBonus={earnedBonus}
            />

            <div className="my-6">
              <ReferralPlansLocked 
                tiers={referralTiers}
                userReferralCount={approvedCount}
              />
            </div>

            <ReferralCode
              isAuthenticated={isAuthenticated}
              userId={user?.id || ''}
            />

            <ReferralShare
              onCopyCode={handleCopyCode}
              isAuthenticated={isAuthenticated}
            />
          </>
        )}
      </div>
      
      <Navigation />
      <FloatingActionButton />
    </div>
  );
};

export default Agent;
