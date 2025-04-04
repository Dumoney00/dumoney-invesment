
import React from 'react';
import { ExternalLink, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AnnouncementBarProps {
  isAuthenticated: boolean;
  username?: string;
}

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ isAuthenticated, username }) => {
  const navigate = useNavigate();
  
  if (!isAuthenticated) {
    return (
      <div className="bg-black border border-investment-gold rounded-full p-3 flex items-center">
        <Volume2 className="text-investment-gold mr-2" size={24} />
        <div className="text-white flex-1">
          <span>Tap to register on CLR Energy app</span>
          <span className="text-investment-gold ml-2">👑</span>
        </div>
        <Button size="sm" variant="ghost" className="text-blue-400" onClick={() => navigate('/auth')}>
          <ExternalLink size={18} />
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-black border border-investment-gold rounded-full p-3 flex items-center">
      <Volume2 className="text-investment-gold mr-2" size={24} />
      <span className="text-white">Welcome, {username}! Earn daily income with our products.</span>
    </div>
  );
};

export default AnnouncementBar;
