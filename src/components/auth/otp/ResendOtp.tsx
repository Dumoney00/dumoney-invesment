
import React, { memo } from 'react';
import { Button } from "@/components/ui/button";

interface ResendOtpProps {
  onResend: () => void;
  isSending: boolean;
  cooldownTime?: number;
}

const ResendOtp: React.FC<ResendOtpProps> = ({ 
  onResend, 
  isSending, 
  cooldownTime = 0 
}) => {
  const buttonText = isSending 
    ? "Sending..." 
    : cooldownTime > 0 
      ? `Resend Code in ${cooldownTime}s` 
      : "Resend Code";

  return (
    <div className="text-center">
      <Button
        variant="link"
        className="text-investment-gold p-0 h-auto transition-all"
        onClick={onResend}
        disabled={isSending || cooldownTime > 0}
      >
        {buttonText}
      </Button>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export default memo(ResendOtp);
