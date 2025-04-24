
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Shield } from 'lucide-react';

const AdminHeader: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-[#333333] p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Shield size={24} className="text-investment-gold" />
        <h1 className="text-white text-xl font-medium">Admin Dashboard</h1>
      </div>
      
      <Button 
        variant="outline" 
        className="border-gray-700 text-white hover:bg-[#222222]"
        onClick={handleLogout}
      >
        <LogOut className="mr-2" size={18} />
        Logout
      </Button>
    </header>
  );
};

export default AdminHeader;
