
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn } from 'lucide-react';
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAdmin } = useSupabaseAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back!"
        });
        
        if (isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
