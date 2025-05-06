
import React, { useState, useEffect } from 'react';
import { Home, Users, BarChart3, User, Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAllUserActivities } from '@/hooks/useAllUserActivities';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { activities, hasNewActivity, setHasNewActivity } = useAllUserActivities();
  
  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Activities', icon: Activity, path: '/activities' },
    { label: 'Agent', icon: Users, path: '/agent' },
    { label: 'Investing', icon: BarChart3, path: '/investing' },
    { label: 'Mine', icon: User, path: '/profile' },
  ];

  // Reset notification if user is on activities page
  useEffect(() => {
    if (location.pathname === '/activities') {
      setHasNewActivity(false);
    }
  }, [location.pathname, setHasNewActivity]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#222222] border-t border-gray-800 max-w-md mx-auto">
      <div className="flex justify-between items-center px-4 py-2">
        {navItems.map((item) => (
          <Link 
            key={item.label} 
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : 'text-gray-400'}`}
          >
            <div className="relative">
              <item.icon size={24} />
              {item.path === '/activities' && hasNewActivity && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-investment-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-investment-gold"></span>
                </span>
              )}
            </div>
            <span>
              {item.label}
              {item.path === '/activities' && hasNewActivity && (
                <span className="ml-1 text-xs text-investment-gold">•</span>
              )}
            </span>
          </Link>
        ))}
      </div>
      <div className="h-6 bg-black"></div>
    </nav>
  );
};

export default Navigation;
