
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await adminLogin(email, password);
      if (success) {
        navigate('/admin');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-12 pb-24">
      {/* Header */}
      <header className="bg-[#333333] py-4">
        <h1 className="text-white text-xl text-center font-medium">
          — Admin Login —
        </h1>
      </header>
      
      {/* Yellow Banner */}
      <div className="bg-investment-yellow h-2"></div>
      
      <div className="max-w-md mx-auto p-5 mt-8">
        <div className="flex justify-center mb-8">
          <Shield size={60} className="text-investment-gold p-3 border-2 border-investment-gold rounded-full" />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-gray-300 mb-1 block">Admin Email</label>
            <Input
              id="email"
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#222222] border-gray-700 text-white"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-gray-300 mb-1 block">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Enter admin password"
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
            {isLoading ? "Processing..." : (
              <>
                <LogIn className="mr-2" size={18} />
                Admin Login
              </>
            )}
          </Button>
          
          <Button 
            type="button" 
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:bg-[#333333]"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
