import { ReferralRecord, UserReferralStats } from '@/types/referrals';
import { showToast } from '@/utils/toastUtils';
import { 
  generateMockReferrals,
  generateMockUserReferralStats 
} from './mockReferralData';
import {
  getUserReferralTier,
  calculateReferralBonus,
  generateReferralCode,
  isReferralOverdue,
  processReferralReward
} from './referralUtils';
import { referralTiers } from '@/config/referralTiers';

export {
  referralTiers,
  getUserReferralTier,
  calculateReferralBonus,
  generateReferralCode,
  isReferralOverdue,
  generateMockReferrals,
  generateMockUserReferralStats
};

// Approve a referral after product purchase
export const handleProductPurchaseReferral = async (
  userId: string,
  referralCode: string | null,
  purchaseAmount: number
): Promise<boolean> => {
  try {
    if (!referralCode) return true; // No referral to process
    
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulating API call
    
    // In a real implementation, you would:
    // 1. Verify the referral code and get referrer data
    // 2. Update referral status to approved
    // 3. Process referral reward for the referrer
    // 4. Update both users' records
    
    showToast(
      "Referral Processed",
      "Referral bonus will be credited after verification"
    );
    
    return true;
  } catch (error) {
    showToast(
      "Referral Processing Failed",
      "Could not process the referral reward",
      "destructive"
    );
    return false;
  }
};

// New utility functions for admin panel
export const approveReferral = async (
  referralId: string,
  adminId: string,
  adminName: string,
  comment?: string
): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return true;
};

export const rejectReferral = async (
  referralId: string,
  adminId: string,
  adminName: string,
  reason: string
): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return true;
};

export const bulkApproveReferrals = async (
  referralIds: string[],
  adminId: string,
  adminName: string
): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return true;
};
