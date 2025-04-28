
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { X } from 'lucide-react';

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

  const handleReject = async () => {
    await onReject(rejectReason);
    setRejectReason('');
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
          className="bg-[#1A1F2C] border-[#33374D] text-white"
        />
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#33374D] text-gray-300 hover:bg-[#1A1F2C]"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleReject}
            disabled={!rejectReason.trim()}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <X size={16} className="mr-1" />
            Reject Referral
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
