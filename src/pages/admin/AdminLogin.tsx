
import React, { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { showToast } from "@/utils/toastUtils";

const AdminLogin = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(emailOrPhone, password);
      
      // Get user from localStorage to check if admin
      const currentUser = localStorage.getItem('investmentUser');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        if (user.isAdmin) {
          showToast("Welcome Admin", "Login successful");
          navigate('/admin');
          return;
        } else {
          showToast("Access Denied", "You don't have admin privileges", "destructive");
        }
      }
      
      if (!success) {
        showToast("Login Failed", "Invalid credentials", "destructive");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1A1F2C] border-gray-800 text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="emailOrPhone" className="text-sm font-medium text-gray-300">
                Email or Phone
              </label>
              <Input
                id="emailOrPhone"
                type="text"
                placeholder="Enter your email or phone"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="bg-[#222222] border-gray-700 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#222222] border-gray-700 text-white"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            variant="link" 
            className="w-full text-gray-400"
            onClick={() => navigate('/')}
          >
            Back to Main App
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
