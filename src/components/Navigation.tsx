
import React, { useState, useEffect } from 'react';
import { Home, Users, BarChart3, User, Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAllUserActivities } from '@/hooks/useAllUserActivities';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { activities } = useAllUserActivities();
  const [hasNewActivity, setHasNewActivity] = useState(false);
  
  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Activities', icon: Activity, path: '/activities' },
    { label: 'Agent', icon: Users, path: '/agent' },
    { label: 'Investing', icon: BarChart3, path: '/investing' },
    { label: 'Mine', icon: User, path: '/profile' },
  ];

  // Check for new activities every few seconds
  useEffect(() => {
    let lastActivity = activities.length > 0 ? new Date(activities[0].timestamp) : new Date();
    
    // Initial check
    if (activities.length > 0) {
      setHasNewActivity(true);
      
      // Reset notification if user is on activities page
      if (location.pathname === '/activities') {
        setHasNewActivity(false);
      }
    }
    
    // Check for new activities
    const checkNewActivities = () => {
      if (activities.length === 0) return;
      
      const newestActivity = new Date(activities[0].timestamp);
      
      // If there's a new activity and user is not on activities page
      if (newestActivity > lastActivity && location.pathname !== '/activities') {
        setHasNewActivity(true);
      }
      
      lastActivity = newestActivity;
    };
    
    const timer = setInterval(checkNewActivities, 3000);
    
    // Reset notification when visiting activities page
    if (location.pathname === '/activities') {
      setHasNewActivity(false);
    }
    
    return () => clearInterval(timer);
  }, [activities, location.pathname]);

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
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-investment-gold animate-pulse"></span>
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
