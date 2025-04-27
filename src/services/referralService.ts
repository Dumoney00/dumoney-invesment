
import { ReferralRecord, ReferralStatus, UserReferralStats, ReferralTierConfig } from '@/types/referrals';
import { v4 as uuidv4 } from 'uuid';

// Define referral tiers
export const referralTiers: ReferralTierConfig[] = [
  {
    level: 'bronze',
    minReferrals: 0,
    maxReferrals: 5,
    bonusRate: 0.05,
    description: 'Bronze Level - 5% bonus rate'
  },
  {
    level: 'silver',
    minReferrals: 6,
    maxReferrals: 20,
    bonusRate: 0.10,
    description: 'Silver Level - 10% bonus rate + priority support'
  },
  {
    level: 'gold',
    minReferrals: 21,
    maxReferrals: null,
    bonusRate: 0.15,
    description: 'Gold Level - 15% bonus rate + exclusive features'
  }
];

// Generate a referral link for a user
export const generateReferralLink = (userId: string, referralCode?: string): string => {
  const code = referralCode || userId.substring(0, 8);
  return `https://energy-investment.site/register?ref=${code}`;
};

// Generate mock referral records for testing
export const generateMockReferrals = (): ReferralRecord[] => {
  const statuses: ReferralStatus[] = ['pending', 'approved', 'rejected'];
  const referrals: ReferralRecord[] = [];
  
  // Generate 15 mock referral records
  for (let i = 0; i < 15; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const dateCreated = new Date();
    dateCreated.setDate(dateCreated.getDate() - Math.floor(Math.random() * 30));
    
    const dateUpdated = new Date(dateCreated);
    if (status !== 'pending') {
      dateUpdated.setDate(dateUpdated.getDate() + Math.floor(Math.random() * 5) + 1);
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

// Approve a referral
export const approveReferral = async (referralId: string, adminId: string, adminName: string, comment?: string): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    return true;
  } catch (error) {
    return false;
  }
};

// Reject a referral
export const rejectReferral = async (referralId: string, adminId: string, adminName: string, reason: string): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    return true;
  } catch (error) {
    return false;
  }
};

// Bulk approve referrals
export const bulkApproveReferrals = async (referralIds: string[], adminId: string, adminName: string): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  } catch (error) {
    return false;
  }
};

// Check if a referral is overdue (older than 48 hours)
export const isReferralOverdue = (dateCreated: string): boolean => {
  const createdDate = new Date(dateCreated);
  const now = new Date();
  const diffHours = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
  return diffHours > 48;
};

// Generate mock referral stats for admin dashboard
export const generateMockReferralStats = () => {
  return {
    totalReferrals: 42,
    pendingReferrals: 15,
    approvedReferrals: 22,
    rejectedReferrals: 5,
    totalBonusAmount: 5200
  };
};

// Generate mock user referral stats for the user list in admin panel
export const generateMockUserReferralStats = (): UserReferralStats[] => {
  const stats: UserReferralStats[] = [];
  
  for (let i = 1; i <= 10; i++) {
    const totalReferrals = Math.floor(Math.random() * 30) + 1;
    const pendingReferrals = Math.floor(Math.random() * 5);
    const rejectedReferrals = Math.floor(Math.random() * 3);
    const approvedReferrals = totalReferrals - pendingReferrals - rejectedReferrals;
    
    // Determine level based on approved referrals
    const level = approvedReferrals >= 21 ? 'gold' : approvedReferrals >= 6 ? 'silver' : 'bronze';
    
    // Calculate bonus amounts
    const bonusRate = level === 'gold' ? 0.15 : level === 'silver' ? 0.10 : 0.05;
    const pendingBonus = pendingReferrals * 200 * bonusRate;
    const totalBonus = approvedReferrals * 200 * bonusRate;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 365));
    
    stats.push({
      userId: `usr_${i}`,
      username: `user${i}`,
      level,
      totalReferrals,
      pendingReferrals,
      approvedReferrals,
      rejectedReferrals,
      pendingBonus,
      totalBonus,
      activeSince: startDate.toISOString()
    });
  }
  
  return stats;
};
