
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import EmailForm from './auth/password-reset/EmailForm';
import OtpVerification from './OtpVerification';
import NewPasswordForm from './auth/password-reset/NewPasswordForm';

interface ForgotPasswordProps {
  onBack: () => void;
  onReset: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack, onReset }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'newPassword'>('email');
  
  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep('otp');
  };

  const handleOtpVerified = () => {
    setStep('newPassword');
  };

  return (
    <div className="min-h-full flex flex-col">
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          className="p-1"
          onClick={onBack}
        >
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-xl font-bold flex-1 text-center pr-8">Forgot Password</h2>
      </div>
      
      <div className="space-y-6">
        {step === 'email' && (
          <EmailForm onEmailSubmit={handleEmailSubmit} />
        )}
        
        {step === 'otp' && (
          <OtpVerification 
            phoneNumber={email} 
            onVerificationComplete={handleOtpVerified}
            onCancel={onBack}
          />
        )}
        
        {step === 'newPassword' && (
          <NewPasswordForm onPasswordReset={onReset} />
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
