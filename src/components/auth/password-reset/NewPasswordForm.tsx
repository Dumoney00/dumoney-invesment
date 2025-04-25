
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2, Lock } from 'lucide-react';

interface NewPasswordFormProps {
  onPasswordReset: () => void;
}

const NewPasswordForm: React.FC<NewPasswordFormProps> = ({ onPasswordReset }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset. You can now log in with your new password."
      });
      onPasswordReset();
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
    <div className="space-y-4">
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
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting...
          </>
        ) : "Reset Password"}
      </Button>
    </div>
  );
};

export default NewPasswordForm;
