
import React, { memo } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

interface OtpActionsProps {
  isVerifying: boolean;
  onVerify: () => void;
  onCancel: () => void;
  isValidOtp: boolean;
}

const OtpActions: React.FC<OtpActionsProps> = ({
  isVerifying,
  onVerify,
  onCancel,
  isValidOtp
}) => {
  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        className="flex-1 border-gray-700 text-gray-300 transition-colors hover:bg-gray-800"
        onClick={onCancel}
        disabled={isVerifying}
        type="button"
      >
        Cancel
      </Button>
      <Button
        className="flex-1 bg-investment-gold hover:bg-investment-gold/90 transition-colors"
        onClick={onVerify}
        disabled={isVerifying || !isValidOtp}
        type="button"
      >
        {isVerifying ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : "Verify OTP"}
      </Button>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export default memo(OtpActions);
