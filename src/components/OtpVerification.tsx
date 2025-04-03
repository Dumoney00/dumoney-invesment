
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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
      // Simulate API call to send OTP
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
      // Simulate API verification call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, we'll consider "123456" as the correct OTP
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
          <div className="flex justify-center">
            <InputOTP 
              maxLength={6}
              value={otp}
              onChange={setOtp}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot 
                      key={index} 
                      {...slot} 
                      index={index} 
                      className="bg-[#333333] border-gray-700"
                    />
                  ))}
                </InputOTPGroup>
              )} 
            />
          </div>
          
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
              onClick={verifyOtp}
              disabled={isVerifying || otp.length !== 6}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : "Verify OTP"}
            </Button>
          </div>
          
          <div className="text-center">
            <Button 
              variant="link" 
              className="text-investment-gold p-0 h-auto"
              onClick={sendOtp}
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Resend Code"}
            </Button>
          </div>
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
