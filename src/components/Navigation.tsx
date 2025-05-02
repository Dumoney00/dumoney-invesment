
import React from 'react';
import { Home, Users, BarChart3, User, Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Activities', icon: Activity, path: '/activities' },
    { label: 'Agent', icon: Users, path: '/agent' },
    { label: 'Investing', icon: BarChart3, path: '/investing' },
    { label: 'Mine', icon: User, path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#222222] border-t border-gray-800 max-w-md mx-auto">
      <div className="flex justify-between items-center px-4 py-2">
        {navItems.map((item) => (
          <Link 
            key={item.label} 
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : 'text-gray-400'}`}
          >
            <item.icon size={24} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
      <div className="h-6 bg-black"></div>
    </nav>
  );
};

export default Navigation;
