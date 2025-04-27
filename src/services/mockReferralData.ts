
import { ReferralRecord, UserReferralStats, ReferralStatus } from '@/types/referrals';
import { v4 as uuidv4 } from 'uuid';
import { getUserReferralTier } from './referralUtils';

export const generateMockReferrals = (): ReferralRecord[] => {
  const statuses: ReferralStatus[] = ['pending', 'approved', 'rejected'];
  const referrals: ReferralRecord[] = [];
  
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

export const generateMockUserReferralStats = (): UserReferralStats[] => {
  const stats: UserReferralStats[] = [];
  
  for (let i = 1; i <= 5; i++) {
    const approvedReferrals = Math.floor(Math.random() * 30);
    const pendingReferrals = Math.floor(Math.random() * 5);
    const rejectedReferrals = Math.floor(Math.random() * 3);
    const totalReferrals = approvedReferrals + pendingReferrals + rejectedReferrals;
    
    const tier = getUserReferralTier(approvedReferrals);
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 6));
    
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
