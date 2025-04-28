
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  BarChart, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AdminHeader from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#121720] text-white">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-30 md:hidden">
        <Button 
          variant="outline" 
          size="icon"
          className="bg-[#1A1F2C]/70 border-[#33374D] text-white hover:bg-[#33374D] backdrop-blur-lg"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-full z-20 transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-64" : "w-20",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-full bg-[#222B45]/95 backdrop-blur-lg border-r border-[#33374D] flex flex-col">
          {/* Logo and collapse button */}
          <div className={cn(
            "flex h-16 items-center gap-2 border-b border-[#33374D] px-4",
            !sidebarOpen && "justify-center"
          )}>
            <div className="w-10 h-10 rounded-full bg-[#8B5CF6] flex items-center justify-center">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-white">Admin Portal</h1>
                <p className="text-xs text-gray-400">Dashboard</p>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:flex hidden text-gray-400 hover:text-white hover:bg-[#33374D]/50"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <ChevronLeft size={18} className={cn(
                "transition-transform",
                !sidebarOpen && "rotate-180"
              )} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <div className="px-3 space-y-1">
              <NavItem
                icon={LayoutDashboard}
                label="Dashboard"
                href="/admin"
                isCollapsed={!sidebarOpen}
                isActive={true}
              />
              <NavItem
                icon={Users}
                label="Users"
                href="/admin?tab=users"
                isCollapsed={!sidebarOpen}
              />
              <NavItem
                icon={CreditCard}
                label="Financial"
                href="/admin?tab=financial"
                isCollapsed={!sidebarOpen}
              />
              <NavItem
                icon={BarChart}
                label="Analytics"
                href="/admin?tab=analytics"
                isCollapsed={!sidebarOpen}
              />
              <NavItem
                icon={Settings}
                label="Settings"
                href="/admin?tab=settings"
                isCollapsed={!sidebarOpen}
              />
            </div>
          </nav>

          {/* User profile */}
          <div className={cn(
            "border-t border-[#33374D] p-4",
            !sidebarOpen && "flex justify-center"
          )}>
            {sidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/30 flex items-center justify-center font-semibold text-[#8B5CF6]">
                  {user?.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{user?.username || 'Admin'}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-auto text-gray-400 hover:text-white hover:bg-[#33374D]/50"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-white hover:bg-[#33374D]/50"
                onClick={handleLogout}
              >
                <LogOut size={18} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "min-h-screen transition-all duration-300 ease-in-out",
        sidebarOpen ? "md:ml-64" : "md:ml-20",
      )}>
        {/* Main header */}
        <AdminHeader />

        {/* Mobile overlay */}
        {mobileOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-10 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Page content */}
        <div className="h-[calc(100vh-4rem)] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isCollapsed: boolean;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, href, isCollapsed, isActive }) => {
  return (
    <a 
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
        isActive 
          ? "bg-[#8B5CF6]/20 text-[#8B5CF6] font-medium" 
          : "text-gray-400 hover:bg-[#33374D]/50 hover:text-white",
        isCollapsed && "justify-center"
      )}
    >
      <Icon size={18} />
      {!isCollapsed && <span>{label}</span>}
    </a>
  );
};

export default AdminLayout;
