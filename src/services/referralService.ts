
import { ReferralRecord, UserReferralStats, ReferralLevel, ReferralTier } from '@/types/referrals';
import { User } from '@/types/auth';
import { showToast } from '@/utils/toastUtils';
import { v4 as uuidv4 } from 'uuid';

// Define the referral tiers configuration
export const referralTiers: ReferralTier[] = [
  {
    level: 'bronze',
    name: 'Bronze',
    minReferrals: 1,
    maxReferrals: 5,
    bonusPercentage: 5,
    benefits: ['5% bonus per referral'],
    color: 'text-amber-600 bg-amber-500/20 border-amber-500/30'
  },
  {
    level: 'silver',
    name: 'Silver',
    minReferrals: 6,
    maxReferrals: 19,
    bonusPercentage: 10,
    benefits: ['10% bonus per referral', 'Priority support'],
    color: 'text-gray-400 bg-gray-500/20 border-gray-400/30'
  },
  {
    level: 'gold',
    name: 'Gold',
    minReferrals: 20,
    maxReferrals: null,
    bonusPercentage: 15,
    benefits: ['15% bonus per referral', 'Priority support', 'Exclusive features'],
    color: 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30'
  }
];

// Get referral tier based on number of approved referrals
export const getUserReferralTier = (approvedReferrals: number): ReferralTier => {
  for (let i = referralTiers.length - 1; i >= 0; i--) {
    const tier = referralTiers[i];
    if (approvedReferrals >= tier.minReferrals) {
      return tier;
    }
  }
  return referralTiers[0]; // Default to bronze
};

// Calculate bonus amount based on user's tier and transaction amount
export const calculateReferralBonus = (referrerStats: UserReferralStats, transactionAmount: number): number => {
  const tier = getUserReferralTier(referrerStats.approvedReferrals);
  return (transactionAmount * tier.bonusPercentage) / 100;
};

// Mock data generation for development
export const generateMockReferrals = (): ReferralRecord[] => {
  const statuses: ReferralStatus[] = ['pending', 'approved', 'rejected'];
  const referrals: ReferralRecord[] = [];
  
  // Generate 15 mock referral records
  for (let i = 0; i < 15; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const dateCreated = new Date();
    dateCreated.setDate(dateCreated.getDate() - Math.floor(Math.random() * 30)); // Random date in the last 30 days
    
    const dateUpdated = new Date(dateCreated);
    if (status !== 'pending') {
      dateUpdated.setDate(dateUpdated.getDate() + Math.floor(Math.random() * 5) + 1); // 1-5 days after creation
    }
    
    referrals.push({
      id: `ref_${uuidv4().substring(0, 8)}`,
      referrerId: `usr_${(i % 5) + 1}`,
      referrerName: `user${(i % 5) + 1}`,
      referredId: `usr_${100 + i}`,
      referredName: `referee${i}`,
      status,
      dateCreated: dateCreated.toISOString(),
      dateUpdated: dateUpdated.toISOString(),
      bonusAmount: Math.floor(Math.random() * 500) + 100,
      adminComment: status === 'rejected' ? ['Invalid email', 'Duplicate account', 'Self-referral detected'][Math.floor(Math.random() * 3)] : undefined,
      adminId: status !== 'pending' ? 'admin_1' : undefined,
      adminName: status !== 'pending' ? 'Administrator' : undefined
    });
  }
  
  return referrals;
};

// Generate mock user referral stats
export const generateMockUserReferralStats = (): UserReferralStats[] => {
  const stats: UserReferralStats[] = [];
  
  // Generate 5 mock user stats records
  for (let i = 1; i <= 5; i++) {
    const approvedReferrals = Math.floor(Math.random() * 30); // 0-29 approved referrals
    const pendingReferrals = Math.floor(Math.random() * 5); // 0-4 pending referrals
    const rejectedReferrals = Math.floor(Math.random() * 3); // 0-2 rejected referrals
    const totalReferrals = approvedReferrals + pendingReferrals + rejectedReferrals;
    
    // Determine level based on approved referrals
    const tier = getUserReferralTier(approvedReferrals);
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 6)); // Random date 0-6 months ago
    
    stats.push({
      userId: `usr_${i}`,
      username: `user${i}`,
      totalReferrals,
      approvedReferrals,
      pendingReferrals,
      rejectedReferrals,
      level: tier.level,
      pendingBonus: pendingReferrals * (Math.floor(Math.random() * 200) + 50),
      totalBonus: approvedReferrals * (Math.floor(Math.random() * 500) + 100),
      activeSince: startDate.toISOString()
    });
  }
  
  return stats;
};

// Approve a referral
export const approveReferral = async (referralId: string, adminId: string, adminName: string, comment?: string): Promise<boolean> => {
  try {
    // This is where you would integrate with your actual API
    // For now, we'll just simulate the behavior
    await new Promise(resolve => setTimeout(resolve, 800));
    
    showToast(
      "Referral Approved",
      `Referral ${referralId} has been approved successfully`
    );
    return true;
  } catch (error) {
    showToast(
      "Action Failed",
      "Could not approve the referral",
      "destructive"
    );
    return false;
  }
};

// Reject a referral
export const rejectReferral = async (referralId: string, adminId: string, adminName: string, reason: string): Promise<boolean> => {
  try {
    // This is where you would integrate with your actual API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    showToast(
      "Referral Rejected",
      `Referral ${referralId} has been rejected`
    );
    return true;
  } catch (error) {
    showToast(
      "Action Failed",
      "Could not reject the referral",
      "destructive"
    );
    return false;
  }
};

// Bulk approve referrals
export const bulkApproveReferrals = async (referralIds: string[], adminId: string, adminName: string): Promise<boolean> => {
  try {
    // This is where you would integrate with your actual API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    showToast(
      "Bulk Action Completed",
      `${referralIds.length} referrals were approved successfully`
    );
    return true;
  } catch (error) {
    showToast(
      "Bulk Action Failed",
      "Could not complete the bulk approval",
      "destructive"
    );
    return false;
  }
};

// Generate a referral link for a user
export const generateReferralLink = (userId: string, referralCode?: string): string => {
  const code = referralCode || userId.substring(0, 8);
  return `https://energy-investment.site/register?ref=${code}`;
};

// Check if a referral is overdue for review (older than 48 hours)
export const isReferralOverdue = (dateCreated: string, thresholdHours: number = 48): boolean => {
  const created = new Date(dateCreated);
  const now = new Date();
  const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  return diffHours > thresholdHours;
};
