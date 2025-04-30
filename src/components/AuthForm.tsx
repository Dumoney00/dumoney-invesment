
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Home } from 'lucide-react';

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-900 pt-12 pb-24 flex flex-col">
      <header className="bg-gray-800 py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-white text-xl text-center font-medium flex items-center justify-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            Authentication Disabled
          </h1>
        </div>
      </header>
      
      <div className="bg-amber-500 h-1"></div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 shadow-xl">
          <div className="text-center mb-8">
            <div className="bg-amber-500/20 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-10 w-10 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
            <p className="text-gray-300 mb-6">
              Login and registration functionality has been disabled for this application.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-300 text-sm">
                Please contact the administrator for access or to request an account.
                For demonstration purposes, you can continue exploring the application.
              </p>
            </div>
            
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center gap-2"
              size="lg"
            >
              <Home className="h-4 w-4" />
              Return to Home
            </Button>
          </div>
        </div>
      </div>
      
      <footer className="py-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Investment App • All Rights Reserved
      </footer>
    </div>
  );
};

export default AuthForm;
