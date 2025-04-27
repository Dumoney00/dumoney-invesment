
export type ReferralStatus = "pending" | "approved" | "rejected";

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

export type ReferralTier = "bronze" | "silver" | "gold";

export interface UserReferralStats {
  userId: string;
  username: string;
  level: ReferralTier;
  totalReferrals: number;
  pendingReferrals: number;
  approvedReferrals: number;
  rejectedReferrals: number;
  pendingBonus: number;
  totalBonus: number;
  activeSince: string;
}

export interface ReferralTierConfig {
  level: ReferralTier;
  minReferrals: number;
  maxReferrals: number | null;
  bonusRate: number;
  description: string;
}
