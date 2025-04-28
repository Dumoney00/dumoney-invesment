
import { useState, useEffect } from 'react';
import { UserReferralStats } from '@/types/referrals';
import { generateMockUserReferralStats } from '@/services/referralService';

export const useReferralStats = () => {
  const [userStats, setUserStats] = useState<UserReferralStats[]>([]);

  useEffect(() => {
    setUserStats(generateMockUserReferralStats());
  }, []);

  return {
    userStats
  };
};
