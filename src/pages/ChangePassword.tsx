
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { toast } from '@/hooks/use-toast';

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePasswordChange = async () => {
    if (!currentPassword) {
      toast({
        title: "Current Password Required",
        description: "Please enter your current password",
        variant: "destructive"
      });
      return;
    }
    
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "Invalid Password",
        description: "New password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your new passwords match",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated"
      });
      
      // Navigate back after successful password change
      navigate('/profile');
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update your password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="bg-[#333333] py-4 relative">
        <Button 
          variant="ghost" 
          className="absolute left-2 top-3 text-gray-300 hover:text-white p-1"
          onClick={() => navigate('/profile')}
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-white text-xl text-center font-medium">— Change Password —</h1>
      </header>
      
      {/* Yellow Banner */}
      <div className="bg-investment-yellow h-2"></div>
      
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="text-gray-300 mb-1 block">Current Password</label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isLoading}
              className="bg-[#222222] border-gray-700 text-white"
              placeholder="Enter current password"
            />
          </div>
          
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
            <label htmlFor="confirmPassword" className="text-gray-300 mb-1 block">Confirm New Password</label>
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
            onClick={handlePasswordChange}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : "Change Password"}
          </Button>
        </div>
      </div>
      
      <Navigation />
    </div>
  );
};

export default ChangePassword;
