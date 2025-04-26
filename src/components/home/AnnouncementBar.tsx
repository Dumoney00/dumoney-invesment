
import React from 'react';
import { Volume2 } from 'lucide-react';

interface AnnouncementBarProps {
  isAuthenticated: boolean;
  username?: string;
}

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ isAuthenticated, username }) => {
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="bg-black border border-investment-gold rounded-full p-3 flex items-center">
      <Volume2 className="text-investment-gold mr-2" size={24} />
      <span className="text-white">Welcome, {username}! Earn daily income with our products.</span>
    </div>
  );
};

export default AnnouncementBar;
