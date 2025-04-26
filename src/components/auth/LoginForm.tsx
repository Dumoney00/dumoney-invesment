
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { findUserByEmailOrPhone } from "@/utils/authUtils";
import { toast } from "@/hooks/use-toast";

const LoginForm: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check if user exists with given email or phone
      const existingUser = findUserByEmailOrPhone(emailOrPhone);
      if (!existingUser) {
        toast({
          title: "Login Failed",
          description: "No account found with this email or phone number",
          variant: "destructive"
        });
        return;
      }

      const success = await login(emailOrPhone, password);
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
        <label htmlFor="emailOrPhone" className="text-gray-300 mb-1 block">
          Email or Phone
        </label>
        <Input
          id="emailOrPhone"
          placeholder="Enter your email or phone"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          required
          className="bg-[#222222] border-gray-700 text-white"
        />
      </div>
      
      <div>
        <label htmlFor="password" className="text-gray-300 mb-1 block">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-[#222222] border-gray-700 text-white"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-investment-gold hover:bg-investment-gold/90"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
