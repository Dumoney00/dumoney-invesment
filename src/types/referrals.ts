
export type ReferralStatus = "pending" | "approved" | "rejected";
export type ReferralLevel = "bronze" | "silver" | "gold";

export interface ReferralTier {
  level: ReferralLevel;
  name: string;
  minReferrals: number;
  maxReferrals: number | null;
  bonusPercentage: number;
  benefits: string[];
  color: string;
}

export interface ReferralRecord {
  id: string;
  referrerId: string;
  referrerName: string;
  referredId: string;
  referredName: string;
  status: ReferralStatus;
  dateCreated: string;
  dateUpdated: string;
  bonusAmount: number;
  adminComment?: string;
  adminId?: string;
  adminName?: string;
}

export interface UserReferralStats {
  userId: string;
  username: string;
  totalReferrals: number;
  approvedReferrals: number;
  pendingReferrals: number;
  rejectedReferrals: number;
  level: ReferralLevel;
  pendingBonus: number;
  totalBonus: number;
  activeSince: string;
}

export interface ReferralSystemConfig {
  tiers: ReferralTier[];
  referralExpiryDays: number;
  notificationThresholdHours: number;
}
