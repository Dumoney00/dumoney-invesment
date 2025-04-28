import { ReferralTier, UserReferralStats } from '@/types/referrals';
import { referralTiers } from '@/config/referralTiers';

// Generate a permanent 5-digit referral code based on userId
export const generateReferralCode = (userId: string): string => {
  // Use the first 5 characters of userId hash to create a permanent code
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Make sure it's positive and 5 digits
  const positiveHash = Math.abs(hash);
  const fiveDigitCode = (positiveHash % 90000 + 10000).toString();
  return fiveDigitCode;
};

export const getUserReferralTier = (approvedReferrals: number): ReferralTier => {
  for (let i = referralTiers.length - 1; i >= 0; i--) {
    const tier = referralTiers[i];
    if (approvedReferrals >= tier.minReferrals) {
      return tier;
    }
  }
  return referralTiers[0];
};

export const calculateReferralBonus = (referrerStats: UserReferralStats, transactionAmount: number): number => {
  const tier = getUserReferralTier(referrerStats.approvedReferrals);
  return (transactionAmount * tier.bonusPercentage) / 100;
};

export const isReferralOverdue = (dateCreated: string, thresholdHours: number = 48): boolean => {
  const created = new Date(dateCreated);
  const now = new Date();
  const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  return diffHours > thresholdHours;
};

export const processReferralReward = async (
  referrerId: string,
  purchaseAmount: number,
  referralStats: UserReferralStats
): Promise<number> => {
  // Calculate bonus based on tier percentage
  const bonusAmount = calculateReferralBonus(referralStats, purchaseAmount);
  
  // In a real implementation, you would:
  // 1. Update referrer's balance
  // 2. Create a referral bonus transaction record
  // 3. Update referral statistics
  
  return bonusAmount;
};
