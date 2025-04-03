
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let success: boolean;
      
      if (isLogin) {
        success = await login(email, password);
      } else {
        success = await register(username, email, password);
      }

      if (success) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBackFromForgotPassword = () => {
    setShowForgotPassword(false);
  };
  
  const handleResetSuccess = () => {
    setShowForgotPassword(false);
    setIsLogin(true);
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-black pt-12 pb-24">
        {/* Header */}
        <header className="bg-[#333333] py-4">
          <h1 className="text-white text-xl text-center font-medium">
            — Forgot Password —
          </h1>
        </header>
        
        {/* Yellow Banner */}
        <div className="bg-investment-yellow h-2"></div>
        
        <div className="max-w-md mx-auto p-5 mt-8">
          <ForgotPassword 
            onBack={handleBackFromForgotPassword}
            onReset={handleResetSuccess}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-12 pb-24">
      {/* Header */}
      <header className="bg-[#333333] py-4">
        <h1 className="text-white text-xl text-center font-medium">
          — {isLogin ? 'Login' : 'Register'} —
        </h1>
      </header>
      
      {/* Yellow Banner */}
      <div className="bg-investment-yellow h-2"></div>
      
      <div className="max-w-md mx-auto p-5 mt-8">
        <div className="flex justify-center mb-8">
          <User size={60} className="text-investment-gold p-3 border-2 border-investment-gold rounded-full" />
        </div>
        
        <div className="flex gap-2 mb-6">
          <Button 
            variant={isLogin ? "default" : "outline"} 
            className={`flex-1 ${isLogin ? 'bg-investment-gold hover:bg-investment-gold/90' : 'text-gray-300 border-gray-700'}`}
            onClick={() => setIsLogin(true)}
          >
            <LogIn className="mr-2" size={18} />
            Login
          </Button>
          <Button 
            variant={!isLogin ? "default" : "outline"} 
            className={`flex-1 ${!isLogin ? 'bg-investment-gold hover:bg-investment-gold/90' : 'text-gray-300 border-gray-700'}`}
            onClick={() => setIsLogin(false)}
          >
            <UserPlus className="mr-2" size={18} />
            Register
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="username" className="text-gray-300 mb-1 block">Username</label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
                className="bg-[#222222] border-gray-700 text-white"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="text-gray-300 mb-1 block">Email</label>
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
            <label htmlFor="password" className="text-gray-300 mb-1 block">Password</label>
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
          
          {isLogin && (
            <div className="text-right">
              <Button 
                variant="link" 
                type="button" 
                className="p-0 h-auto text-investment-gold"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </Button>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-investment-gold hover:bg-investment-gold/90"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : isLogin ? "Login" : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
