
import React from 'react';
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
        className="flex-1 border-gray-700 text-gray-300"
        onClick={onCancel}
        disabled={isVerifying}
      >
        Cancel
      </Button>
      <Button
        className="flex-1 bg-investment-gold hover:bg-investment-gold/90"
        onClick={onVerify}
        disabled={isVerifying || !isValidOtp}
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

export default OtpActions;
