
import { ReferralRecord } from '@/types/referrals';
import { v4 as uuidv4 } from 'uuid';

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
