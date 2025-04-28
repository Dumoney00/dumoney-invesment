
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { X } from 'lucide-react';
import { showToast } from '@/utils/toastUtils';

interface ReferralRejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReject: (reason: string) => Promise<void>;
}

export const ReferralRejectDialog: React.FC<ReferralRejectDialogProps> = ({
  open,
  onOpenChange,
  onReject
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      showToast(
        "Validation Error", 
        "Please provide a reason for rejection",
        "destructive"
      );
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onReject(rejectReason);
      setRejectReason('');
      showToast("Success", "Referral rejected successfully");
    } catch (error) {
      showToast(
        "Error", 
        "Failed to reject referral. Please try again.",
        "destructive"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#222B45] border-[#33374D] text-white">
        <DialogHeader>
          <DialogTitle>Reject Referral</DialogTitle>
          <DialogDescription className="text-gray-400">
            Please provide a reason for rejection. This will be visible to the referrer.
          </DialogDescription>
        </DialogHeader>
        
        <Textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Reason for rejection..."
          className="bg-[#1A1F2C] border-[#33374D] text-white min-h-[100px]"
        />
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#33374D] text-gray-300 hover:bg-[#1A1F2C]"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleReject}
            disabled={!rejectReason.trim() || isSubmitting}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <X size={16} className="mr-1" />
            {isSubmitting ? "Rejecting..." : "Reject Referral"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
