
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
