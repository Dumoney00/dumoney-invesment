import { ReferralRecord, UserReferralStats } from '@/types/referrals';
import { showToast } from '@/utils/toastUtils';
import { 
  generateMockReferrals,
  generateMockUserReferralStats 
} from './mockReferralData';
import {
  getUserReferralTier,
  calculateReferralBonus,
  generateReferralLink,
  isReferralOverdue,
  processReferralReward
} from './referralUtils';
import { referralTiers } from '@/config/referralTiers';

export {
  referralTiers,
  getUserReferralTier,
  calculateReferralBonus,
  generateReferralLink,
  isReferralOverdue,
  generateMockReferrals,
  generateMockUserReferralStats
};

// Approve a referral
export const approveReferral = async (
  referralId: string, 
  adminId: string, 
  adminName: string, 
  comment?: string
): Promise<boolean> => {
  try {
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
export const rejectReferral = async (
  referralId: string, 
  adminId: string, 
  adminName: string, 
  reason: string
): Promise<boolean> => {
  try {
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
export const bulkApproveReferrals = async (
  referralIds: string[], 
  adminId: string, 
  adminName: string
): Promise<boolean> => {
  try {
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

export const handleProductPurchaseReferral = async (
  userId: string,
  referralCode: string | null,
  purchaseAmount: number
): Promise<boolean> => {
  try {
    if (!referralCode) return true; // No referral to process
    
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulating API call
    
    // In a real implementation, you would:
    // 1. Verify the referral code
    // 2. Get referrer's stats
    // 3. Process the referral reward
    // 4. Update both users' records
    
    showToast(
      "Referral Processed",
      "Referral bonus has been credited to the referrer"
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
