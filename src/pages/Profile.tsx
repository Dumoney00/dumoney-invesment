
import React from 'react';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Import the new components
import ProfileHeader from '@/components/profile/ProfileHeader';
import AccountStats from '@/components/profile/AccountStats';
import QuickActions from '@/components/profile/QuickActions';
import PartnerBanner from '@/components/profile/PartnerBanner';
import CommonTools from '@/components/profile/CommonTools';

const Profile: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="bg-[#333333] py-4">
        <h1 className="text-white text-xl text-center font-medium">— Mine —</h1>
      </header>
      
      {/* Yellow Banner */}
      <div className="bg-investment-yellow h-2"></div>
      
      {/* Profile Section */}
      <div className="p-6">
        <ProfileHeader />
        
        {/* Account Stats */}
        {isAuthenticated && user && <AccountStats user={user} />}
        
        {/* Quick Actions */}
        {isAuthenticated && user && <QuickActions />}
        
        {/* Partner banner */}
        <PartnerBanner />
        
        {/* Common Tools Section */}
        <CommonTools />
        
        {/* Logout Button */}
        {isAuthenticated && (
          <Button 
            variant="outline" 
            className="w-full border-gray-700 text-white hover:bg-[#333333] hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="mr-2" size={18} />
            Logout
          </Button>
        )}
      </div>
      
      <Navigation />
      <FloatingActionButton />
    </div>
  );
};

export default Profile;
