
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
      `Referral bonus of $${amount} approved for user ${userId}`
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
