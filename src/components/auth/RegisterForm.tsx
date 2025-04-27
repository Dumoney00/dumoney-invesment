
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { checkExistingUser } from "@/utils/authUtils";
import { toast } from "@/hooks/use-toast";

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check for existing user
      if (checkExistingUser(email, phone)) {
        toast({
          title: "Registration Failed",
          description: "An account with this email or phone number already exists. Please login instead.",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      const success = await register(username, email, phone, password, referralCode);
      if (success) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="text-gray-300 mb-1 block">
          Username
        </label>
        <Input
          id="username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="bg-[#222222] border-gray-700 text-white"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="text-gray-300 mb-1 block">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-[#222222] border-gray-700 text-white"
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="text-gray-300 mb-1 block">
          Phone Number
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="bg-[#222222] border-gray-700 text-white"
        />
      </div>

      <div>
        <label htmlFor="registerPassword" className="text-gray-300 mb-1 block">
          Password
        </label>
        <Input
          id="registerPassword"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-[#222222] border-gray-700 text-white"
        />
      </div>

      <div>
        <label htmlFor="referralCode" className="text-gray-300 mb-1 block">
          Referral Code (Optional)
        </label>
        <Input
          id="referralCode"
          placeholder="Enter 5-digit referral code"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          maxLength={5}
          pattern="[0-9]{5}"
          className="bg-[#222222] border-gray-700 text-white"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-investment-gold hover:bg-investment-gold/90"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Register"}
      </Button>
    </form>
  );
};

export default RegisterForm;
