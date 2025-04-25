
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import OtpInput from './auth/otp/OtpInput';
import OtpActions from './auth/otp/OtpActions';
import ResendOtp from './auth/otp/ResendOtp';

interface OtpVerificationProps {
  phoneNumber: string;
  onVerificationComplete: () => void;
  onCancel: () => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({
  phoneNumber,
  onVerificationComplete,
  onCancel
}) => {
  const [otp, setOtp] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = async () => {
    setIsSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to ${phoneNumber}`
      });
    } catch (error) {
      toast({
        title: "Failed to Send OTP",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (otp === "123456") {
        toast({
          title: "Verification Successful",
          description: "Your phone number has been verified"
        });
        onVerificationComplete();
      } else {
        toast({
          title: "Invalid OTP",
          description: "The verification code you entered is incorrect",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-[#222222] p-6 rounded-lg space-y-6">
      <div className="text-center">
        <h3 className="text-white text-xl font-bold mb-2">Phone Verification</h3>
        <p className="text-gray-400">
          {otpSent
            ? `Enter the 6-digit code sent to ${phoneNumber}`
            : `We'll send a verification code to ${phoneNumber}`}
        </p>
      </div>

      {otpSent ? (
        <div className="space-y-6">
          <OtpInput
            value={otp}
            onChange={setOtp}
            disabled={isVerifying}
          />
          <OtpActions
            isVerifying={isVerifying}
            onVerify={verifyOtp}
            onCancel={onCancel}
            isValidOtp={otp.length === 6}
          />
          <ResendOtp
            onResend={sendOtp}
            isSending={isSending}
          />
        </div>
      ) : (
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-gray-700 text-gray-300"
            onClick={onCancel}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-investment-gold hover:bg-investment-gold/90"
            onClick={sendOtp}
            disabled={isSending}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : "Send OTP"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OtpVerification;
