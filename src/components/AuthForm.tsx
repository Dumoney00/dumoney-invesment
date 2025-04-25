
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { User, LogIn, UserPlus } from 'lucide-react';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import ForgotPassword from './ForgotPassword';

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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
        <header className="bg-[#333333] py-4">
          <h1 className="text-white text-xl text-center font-medium">
            — Forgot Password —
          </h1>
        </header>
        
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
      <header className="bg-[#333333] py-4">
        <h1 className="text-white text-xl text-center font-medium">
          — {isLogin ? 'Login' : 'Register'} —
        </h1>
      </header>
      
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

        {isLogin ? (
          <>
            <LoginForm />
            <div className="text-right mt-4">
              <Button 
                variant="link" 
                type="button" 
                className="p-0 h-auto text-investment-gold"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </Button>
            </div>
          </>
        ) : (
          <RegisterForm />
        )}
      </div>
    </div>
  );
};

export default AuthForm;
