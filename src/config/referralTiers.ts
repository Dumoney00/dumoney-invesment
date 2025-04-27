
import { ReferralTier } from '@/types/referrals';

export const referralTiers: ReferralTier[] = [
  {
    level: 'bronze',
    name: 'Plan 1',
    minReferrals: 10,
    maxReferrals: 24,
    bonusPercentage: 5,
    benefits: ['One-time reward ₹800'],
    color: 'text-amber-600 bg-amber-500/20 border-amber-500/30'
  },
  {
    level: 'silver',
    name: 'Plan 2',
    minReferrals: 25,
    maxReferrals: 49,
    bonusPercentage: 10,
    benefits: ['One-time reward ₹2,000'],
    color: 'text-gray-400 bg-gray-500/20 border-gray-400/30'
  },
  {
    level: 'gold',
    name: 'Plan 3',
    minReferrals: 50,
    maxReferrals: 249,
    bonusPercentage: 15,
    benefits: ['One-time reward ₹5,000'],
    color: 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30'
  },
  {
    level: 'platinum',
    name: 'Plan 4',
    minReferrals: 250,
    maxReferrals: 649,
    bonusPercentage: 20,
    benefits: ['One-time reward ₹15,000'],
    color: 'text-purple-400 bg-purple-500/20 border-purple-500/30'
  },
  {
    level: 'diamond',
    name: 'Plan 5',
    minReferrals: 650,
    maxReferrals: 1199,
    bonusPercentage: 25,
    benefits: ['One-time reward ₹100,000'],
    color: 'text-blue-400 bg-blue-500/20 border-blue-500/30'
  },
  {
    level: 'crown',
    name: 'Plan 6',
    minReferrals: 1200,
    maxReferrals: null,
    bonusPercentage: 30,
    benefits: ['One-time reward ₹500,000', 'Monthly salary ₹35,000'],
    color: 'text-red-400 bg-red-500/20 border-red-500/30'
  }
];
