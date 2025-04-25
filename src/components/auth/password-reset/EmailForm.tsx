
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2, Mail } from 'lucide-react';

interface EmailFormProps {
  onEmailSubmit: (email: string) => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ onEmailSubmit }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
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
      onEmailSubmit(email);
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

  return (
    <div className="space-y-4">
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
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : "Send Reset Link"}
      </Button>
    </div>
  );
};

export default EmailForm;
