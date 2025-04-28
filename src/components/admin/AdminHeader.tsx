
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };
  
  return (
    <header className="bg-[#222222] border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-white mr-2">Admin Dashboard</h1>
          {user && (
            <span className="bg-blue-900 text-white text-xs px-2 py-1 rounded">
              {user.username}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline"
            className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
            onClick={() => navigate('/')}
          >
            Go to App
          </Button>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="bg-red-900 hover:bg-red-800 text-white border-red-800"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
