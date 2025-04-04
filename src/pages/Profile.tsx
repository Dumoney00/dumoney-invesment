
import React from 'react';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import { User, Wallet, Bell, Settings, HelpCircle, LogOut, MessageCircle, Download, Info, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Profile: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    navigate('/auth');
  };

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id)
        .then(() => {
          toast({
            title: "Copied!",
            description: "User ID copied to clipboard"
          });
        })
        .catch(err => {
          toast({
            title: "Failed to copy",
            description: "Please try again",
            variant: "destructive"
          });
        });
    }
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
        {isAuthenticated && user ? (
          <div className="flex items-center gap-4 mb-8">
            <div className="h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center">
              <User size={32} className="text-gray-300" />
            </div>
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold">{user.username}</h2>
              <div className="flex items-center">
                <p className="text-gray-400">ID: {user.id.substring(0, 8)}</p>
                <Button 
                  variant="ghost" 
                  className="h-6 w-6 p-0 ml-1 text-gray-400"
                  onClick={handleCopyId}
                >
                  <ExternalLink size={12} />
                </Button>
              </div>
            </div>
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-700 text-gray-300"
                onClick={() => navigate('/profile/edit')}
              >
                Edit
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center">
                <User size={32} className="text-gray-300" />
              </div>
              <div>
                <h2 className="text-white text-xl font-bold">Guest User</h2>
                <p className="text-gray-400">Please login to continue</p>
              </div>
            </div>
            <Button 
              className="bg-investment-gold hover:bg-investment-gold/90" 
              onClick={handleLoginRedirect}
            >
              Login
            </Button>
          </div>
        )}
        
        {/* Account Stats */}
        {isAuthenticated && user && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#222222] p-4 rounded-lg flex flex-col items-center">
              <p className="text-investment-gold text-xl font-bold">₹{user.balance.toFixed(2)}</p>
              <p className="text-gray-400 text-xs">Total assets</p>
            </div>
            <div className="bg-[#222222] p-4 rounded-lg flex flex-col items-center">
              <p className="text-investment-gold text-xl font-bold">₹{user.totalDeposit.toFixed(2)}</p>
              <p className="text-gray-400 text-xs">Total Deposit</p>
            </div>
            <div className="bg-[#222222] p-4 rounded-lg flex flex-col items-center">
              <p className="text-investment-gold text-xl font-bold">₹{user.totalWithdraw.toFixed(2)}</p>
              <p className="text-gray-400 text-xs">Total Withdraw</p>
            </div>
          </div>
        )}
        
        {/* Quick Actions */}
        {isAuthenticated && user && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div 
              className="flex flex-col items-center gap-2" 
              onClick={() => navigate('/deposit')}
            >
              <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center">
                <Wallet size={20} className="text-white" />
              </div>
              <span className="text-white text-xs">Deposit</span>
            </div>
            
            <div 
              className="flex flex-col items-center gap-2"
              onClick={() => navigate('/withdraw')}
            >
              <div className="h-12 w-12 rounded-full bg-red-500 flex items-center justify-center">
                <Wallet size={20} className="text-white" />
              </div>
              <span className="text-white text-xs">Withdraw</span>
            </div>
            
            <div 
              className="flex flex-col items-center gap-2"
              onClick={() => navigate('/change-password')}
            >
              <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                <Settings size={20} className="text-white" />
              </div>
              <span className="text-white text-xs">Password</span>
            </div>
            
            <div 
              className="flex flex-col items-center gap-2"
              onClick={() => navigate('/account')}
            >
              <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <span className="text-white text-xs">Account</span>
            </div>
          </div>
        )}
        
        {/* Partner banner */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-investment-gold to-yellow-500 rounded-lg p-4 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-white text-xl font-bold mb-1">Become a partner and receive</h3>
              <p className="text-white text-xl font-bold">daily salary rewards</p>
              <Button 
                className="mt-2 bg-white text-investment-gold hover:bg-white/90"
                onClick={() => navigate('/agent')}
              >
                Click to enter
              </Button>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute right-0 bottom-0 h-20 w-20 bg-yellow-300 rounded-full opacity-20"></div>
            <div className="absolute right-8 top-0 h-12 w-12 bg-yellow-300 rounded-full opacity-20"></div>
            <div className="absolute left-4 bottom-0 h-16 w-16 bg-green-300 rounded-full opacity-20"></div>
          </div>
        </div>
        
        {/* Common Tools Section */}
        <div className="mb-6">
          <h3 className="text-investment-gold text-lg font-medium mb-4">Common tool</h3>
          
          <div className="space-y-4">
            <div className="bg-[#222222] rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-investment-gold">
                  <Wallet size={24} />
                </div>
                <span className="text-white">Envelope</span>
              </div>
              <span className="text-gray-400">&gt;</span>
            </div>
            
            <div className="bg-[#222222] rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-investment-gold">
                  <User size={24} />
                </div>
                <span className="text-white">Account</span>
              </div>
              <span className="text-gray-400">&gt;</span>
            </div>
            
            <div className="bg-[#222222] rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-investment-gold">
                  <MessageCircle size={24} />
                </div>
                <span className="text-white">History</span>
              </div>
              <span className="text-gray-400">&gt;</span>
            </div>
            
            <div className="bg-[#222222] rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-investment-gold">
                  <HelpCircle size={24} />
                </div>
                <span className="text-white">Guide</span>
              </div>
              <span className="text-gray-400">&gt;</span>
            </div>
            
            <div className="bg-[#222222] rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-investment-gold">
                  <Info size={24} />
                </div>
                <span className="text-white">About us</span>
              </div>
              <span className="text-gray-400">&gt;</span>
            </div>
            
            <div className="bg-[#222222] rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-investment-gold">
                  <MessageCircle size={24} />
                </div>
                <span className="text-white">App Reviews</span>
              </div>
              <span className="text-gray-400">&gt;</span>
            </div>
            
            <div className="bg-[#222222] rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-investment-gold">
                  <Download size={24} />
                </div>
                <span className="text-white">Download App</span>
              </div>
              <span className="text-gray-400">&gt;</span>
            </div>
          </div>
        </div>
        
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
