
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from 'lucide-react';

interface ForgotPasswordProps {
  onBack: () => void;
  onReset: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack, onReset }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp' | 'newPassword'>('email');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendResetLink = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your email"
      });
      
      setStep('otp');
    } catch (error) {
      toast({
        title: "Failed to Send",
        description: "Could not send reset email. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid verification code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, we'll consider "123456" as valid OTP
      if (otp === "123456") {
        toast({
          title: "OTP Verified",
          description: "Please set your new password"
        });
        setStep('newPassword');
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
        description: "Could not verify OTP. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset. You can now log in with your new password."
      });
      
      onReset();
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "Could not reset password. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col">
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          className="p-1"
          onClick={onBack}
          disabled={isLoading}
        >
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-xl font-bold flex-1 text-center pr-8">Forgot Password</h2>
      </div>
      
      <div className="space-y-6">
        {step === 'email' && (
          <>
            <div>
              <label htmlFor="email" className="text-gray-300 mb-1 block">Enter your email address</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-[#222222] border-gray-700 text-white"
                placeholder="Email address"
              />
            </div>
            
            <Button 
              className="w-full bg-investment-gold hover:bg-investment-gold/90"
              onClick={handleSendResetLink}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : "Send Reset Link"}
            </Button>
          </>
        )}
        
        {step === 'otp' && (
          <>
            <div className="text-center mb-4">
              <p className="text-gray-300">Enter the 6-digit code sent to {email}</p>
            </div>
            
            <div>
              <label htmlFor="otp" className="text-gray-300 mb-1 block">Verification Code</label>
              <Input
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={isLoading}
                className="bg-[#222222] border-gray-700 text-white"
                placeholder="Enter 6-digit code"
              />
            </div>
            
            <Button 
              className="w-full bg-investment-gold hover:bg-investment-gold/90"
              onClick={handleVerifyOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : "Verify Code"}
            </Button>
            
            <div className="text-center">
              <Button 
                variant="link" 
                className="text-investment-gold p-0 h-auto"
                onClick={() => {
                  if (!isLoading) handleSendResetLink();
                }}
                disabled={isLoading}
              >
                Resend Code
              </Button>
            </div>
          </>
        )}
        
        {step === 'newPassword' && (
          <>
            <div>
              <label htmlFor="newPassword" className="text-gray-300 mb-1 block">New Password</label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                className="bg-[#222222] border-gray-700 text-white"
                placeholder="Enter new password"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="text-gray-300 mb-1 block">Confirm Password</label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="bg-[#222222] border-gray-700 text-white"
                placeholder="Confirm new password"
              />
            </div>
            
            <Button 
              className="w-full bg-investment-gold hover:bg-investment-gold/90"
              onClick={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : "Reset Password"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
