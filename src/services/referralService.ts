
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

    // Get all users to find referrer
    const storedUsers = localStorage.getItem('investmentUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Find referrer by their referral code
    const referrer = users.find((user: any) => 
      generateReferralCode(user.id) === referralCode
    );
    
    if (referrer) {
      // Get referrer's stats - get the first one matching the referrer's ID
      const referrerStats = generateMockUserReferralStats().find(
        stats => stats.userId === referrer.id
      );
      
      if (referrerStats) {
        // Calculate and process bonus
        const bonusAmount = await processReferralReward(
          referrer.id,
          purchaseAmount,
          referrerStats
        );
        
        // Update referrer's balance
        referrer.balance = (referrer.balance || 0) + bonusAmount;
        
        // Update users array in localStorage
        localStorage.setItem('investmentUsers', JSON.stringify(users));
        
        showToast(
          "Referral Processed",
          "Referral bonus will be credited after verification"
        );
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error processing referral:", error);
    showToast(
      "Referral Processing Failed",
      "Could not process the referral reward",
      "destructive"
    );
    return false;
  }
};

// Admin utility functions
export const approveReferral = async (
  referralId: string,
  adminId: string,
  adminName: string,
  comment?: string
): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    showToast("Success", "Referral approved successfully");
    return true;
  } catch (error) {
    console.error("Error approving referral:", error);
    showToast("Error", "Failed to approve referral", "destructive");
    return false;
  }
};

export const rejectReferral = async (
  referralId: string,
  adminId: string,
  adminName: string,
  reason: string
): Promise<boolean> => {
  try {
    if (!reason.trim()) {
      showToast("Error", "Rejection reason is required", "destructive");
      return false;
    }
    
    await new Promise(resolve => setTimeout(resolve, 800));
    showToast("Success", "Referral rejected successfully");
    return true;
  } catch (error) {
    console.error("Error rejecting referral:", error);
    showToast("Error", "Failed to reject referral", "destructive");
    return false;
  }
};

export const bulkApproveReferrals = async (
  referralIds: string[],
  adminId: string,
  adminName: string
): Promise<boolean> => {
  try {
    if (referralIds.length === 0) {
      showToast("Error", "No referrals selected", "destructive");
      return false;
    }
    
    await new Promise(resolve => setTimeout(resolve, 800));
    showToast("Success", `${referralIds.length} referrals approved successfully`);
    return true;
  } catch (error) {
    console.error("Error bulk approving referrals:", error);
    showToast("Error", "Failed to approve referrals", "destructive");
    return false;
  }
};

// Fetch user's personal referrals
export const fetchUserReferrals = async (userId: string): Promise<ReferralRecord[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    // In a real implementation, you would fetch from an API
    const allReferrals = generateMockReferrals();
    return allReferrals.filter(r => r.referrerId === userId);
  } catch (error) {
    console.error("Error fetching user referrals:", error);
    showToast("Error", "Failed to load referrals", "destructive");
    return [];
  }
};
