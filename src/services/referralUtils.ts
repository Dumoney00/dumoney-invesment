
import { ReferralTier, UserReferralStats } from '@/types/referrals';
import { referralTiers } from '@/config/referralTiers';

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

export const generateReferralLink = (userId: string, referralCode?: string): string => {
  const code = referralCode || userId.substring(0, 8);
  return `https://DuMoney.site/register?ref=${code}`;
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

