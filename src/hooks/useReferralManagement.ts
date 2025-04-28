
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ReferralRecord, UserReferralStats } from '@/types/referrals';
import { 
  generateMockReferrals, 
  generateMockUserReferralStats,
  approveReferral,
  rejectReferral,
  bulkApproveReferrals
} from '@/services/referralService';

export const useReferralManagement = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedReferrals, setSelectedReferrals] = useState<string[]>([]);
  const [selectedReferral, setSelectedReferral] = useState<ReferralRecord | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const handleApproveReferral = async (referralId: string) => {
    if (!user?.isAdmin) return;
    
    setLoading(true);
    try {
      const success = await approveReferral(
        referralId,
        user.id,
        user.username,
        undefined
      );
      
      return success;
    } finally {
      setLoading(false);
    }
  };

  const handleBulkApprove = async () => {
    if (!user?.isAdmin || selectedReferrals.length === 0) return;
    
    setLoading(true);
    try {
      const success = await bulkApproveReferrals(
        selectedReferrals,
        user.id,
        user.username
      );
      
      if (success) {
        setSelectedReferrals([]);
      }
      return success;
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (reason: string): Promise<void> => {
    if (!user?.isAdmin || !selectedReferral) return;
    
    setLoading(true);
    try {
      const success = await rejectReferral(
        selectedReferral.id,
        user.id,
        user.username,
        reason
      );
      
      if (success) {
        setRejectDialogOpen(false);
        setSelectedReferral(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    selectedReferrals,
    setSelectedReferrals,
    selectedReferral,
    setSelectedReferral,
    rejectDialogOpen,
    setRejectDialogOpen,
    handleApproveReferral,
    handleBulkApprove,
    handleReject
  };
};
