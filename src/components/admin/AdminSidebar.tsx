
import { Home, Users, BarChart4, CreditCard, Settings, LogOut, Activity } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface AdminSidebarProps {
  onClose?: () => void;
}

export const AdminSidebar = ({ onClose }: AdminSidebarProps) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/admin" },
    { icon: CreditCard, label: "Transactions", path: "/admin?tab=transactions" },
    { icon: Users, label: "Users", path: "/admin?tab=users" },
    { icon: BarChart4, label: "Referrals", path: "/admin?tab=referrals" },
    { icon: Activity, label: "Activity", path: "/admin?tab=activity" },
    { icon: Settings, label: "Settings", path: "/admin?tab=settings" },
  ];
  
  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 to-black w-full p-4 text-white flex flex-col border-r border-gray-800">
      <div className="mb-8 p-4">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500">
          InvestDash
        </h1>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
                            (location.pathname === "/admin" && 
                             location.search === (item.path.includes("?") ? item.path.substring(item.path.indexOf("?")) : ""));
            
            return (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${
                    isActive 
                      ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 font-medium" 
                      : "text-gray-400 hover:text-gray-100 hover:bg-gray-800/50"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-amber-400" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-5 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="mt-auto pb-8">
        <Link 
          to="/" 
          onClick={onClose}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Exit Admin</span>
        </Link>
      </div>
    </div>
  );
};
