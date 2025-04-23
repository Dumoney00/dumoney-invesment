
import React from 'react';
import { User, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const ProfileHeader: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
    <>
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
          {/* Edit button removed */}
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
    </>
  );
};

export default ProfileHeader;
