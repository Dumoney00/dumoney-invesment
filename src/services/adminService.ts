
import { User } from "@/types/auth";
import { showToast } from "@/utils/toastUtils";

const allowedAdmins = [
  { email: 'admin@example.com', password: 'admin123' },
  { email: 'dvenkatkaka001@gmail.com', password: 'admin123' },
  { email: 'dvenkatkaka001@gmail.com', password: 'Nidasameer0@' }
];

export const validateAdminCredentials = (email: string, password: string): boolean => {
  return allowedAdmins.some(
    admin => admin.email === email && admin.password === password
  );
};

export const createAdminUser = (email: string): User => ({
  id: 'admin_' + Math.random().toString(36).substr(2, 9),
  username: 'Administrator',
  email,
  balance: 0,
  withdrawalBalance: 0,
  totalDeposit: 0,
  totalWithdraw: 0,
  dailyIncome: 0,
  investmentQuantity: 0,
  ownedProducts: [],
  isAdmin: true
});

export const handleUserBlock = async (userId: string): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    showToast(
      "User Blocked",
      `User ${userId} has been blocked successfully`
    );
    return true;
  } catch (error) {
    showToast(
      "Action Failed",
      "Could not block the user",
      "destructive"
    );
    return false;
  }
};

export const handleUserUnblock = async (userId: string): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    showToast(
      "User Unblocked",
      `User ${userId} has been unblocked successfully`
    );
    return true;
  } catch (error) {
    showToast(
      "Action Failed",
      "Could not unblock the user",
      "destructive"
    );
    return false;
  }
};

export const handleReferralBonus = async (userId: string, amount: number): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    showToast(
      "Bonus Approved",
      `Referral bonus of ₹${amount.toLocaleString()} approved for user ${userId}`
    );
    return true;
  } catch (error) {
    showToast(
      "Action Failed",
      "Could not approve the referral bonus",
      "destructive"
    );
    return false;
  }
};

// Add these new functions for audit logging
export const logAdminAction = async (
  adminId: string, 
  adminName: string, 
  action: string, 
  targetId?: string, 
  details?: string
): Promise<boolean> => {
  try {
    // This would log to a database in a real implementation
    console.log(`ADMIN ACTION: ${adminName} (${adminId}) ${action} ${targetId || ''} ${details || ''}`);
    return true;
  } catch (error) {
    console.error('Failed to log admin action:', error);
    return false;
  }
};

export const getAdminAuditLogs = async (
  filters?: { adminId?: string; dateFrom?: Date; dateTo?: Date; action?: string }
): Promise<any[]> => {
  // This would fetch from a database in a real implementation
  return [];
};

// Handle security verification for referrals
export const verifyReferral = async (
  referrerId: string,
  referredId: string,
  ipAddress: string,
  deviceInfo: string
): Promise<{ valid: boolean; reason?: string }> => {
  // This function would perform checks for:
  // 1. Self-referral (same person)
  // 2. IP address matching (potential fake accounts)
  // 3. Device fingerprinting (same device creating multiple accounts)
  // 4. Previous referral patterns (fraud detection)
  
  // For demo, we'll just return valid
  return { valid: true };
};

// Function to notify users about referral status changes
export const sendReferralNotification = async (
  userId: string, 
  notificationType: 'approval' | 'rejection' | 'tier-change',
  details?: any
): Promise<boolean> => {
  // This would send notifications in a real implementation
  console.log(`NOTIFICATION to ${userId}: ${notificationType}`, details);
  return true;
};
