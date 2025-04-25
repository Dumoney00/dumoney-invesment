
import React from 'react';
import { Button } from "@/components/ui/button";

interface ResendOtpProps {
  onResend: () => void;
  isSending: boolean;
}

const ResendOtp: React.FC<ResendOtpProps> = ({ onResend, isSending }) => {
  return (
    <div className="text-center">
      <Button
        variant="link"
        className="text-investment-gold p-0 h-auto"
        onClick={onResend}
        disabled={isSending}
      >
        {isSending ? "Sending..." : "Resend Code"}
      </Button>
    </div>
  );
};

export default ResendOtp;
