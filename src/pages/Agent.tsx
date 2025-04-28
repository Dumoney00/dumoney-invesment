
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useAuth } from '@/contexts/AuthContext';
import AgentHeader from '@/components/agent/AgentHeader';
import ReferralStats from '@/components/agent/ReferralStats';
import ReferralCode from '@/components/agent/ReferralCode';
import ReferralShare from '@/components/agent/ReferralShare';
import { 
  getUserReferralTier,
  generateMockReferrals,
  referralTiers
} from '@/services/referralService';
import { ReferralRecord } from '@/types/referrals';

const Agent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      setReferrals(generateMockReferrals());
    }
  }, [isAuthenticated]);

  const userReferrals = referrals.filter(r => 
    isAuthenticated && user && r.referrerId === user.id
  );

  const approvedCount = userReferrals.filter(r => r.status === 'approved').length;
  const pendingCount = userReferrals.filter(r => r.status === 'pending').length;
  const earnedBonus = userReferrals
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.bonusAmount, 0);

  const userTier = isAuthenticated && user 
    ? getUserReferralTier(userReferrals.filter(r => r.status === 'approved').length)
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
        <ReferralStats
          userTier={userTier}
          userReferrals={userReferrals}
          approvedCount={approvedCount}
          pendingCount={pendingCount}
          earnedBonus={earnedBonus}
        />

        <ReferralCode
          isAuthenticated={isAuthenticated}
          userId={user?.id || ''}
        />

        <ReferralShare
          onCopyCode={handleCopyCode}
          isAuthenticated={isAuthenticated}
        />
      </div>
      
      <Navigation />
      <FloatingActionButton />
    </div>
  );
};

export default Agent;
