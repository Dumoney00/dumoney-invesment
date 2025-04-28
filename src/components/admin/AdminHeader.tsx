
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const AdminHeader = () => {
  const { logout } = useAuth();
  
  return (
    <header className="bg-[#222222] border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
        <Button 
          variant="ghost" 
          onClick={logout}
          className="text-gray-300 hover:text-white"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
