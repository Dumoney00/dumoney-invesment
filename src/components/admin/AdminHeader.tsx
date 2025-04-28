
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const AdminHeader = () => {
  const { user, logout } = useAuth();
  
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
            onClick={() => window.location.href = '/'}
          >
            Go to App
          </Button>
          <Button 
            variant="outline" 
            onClick={logout}
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
