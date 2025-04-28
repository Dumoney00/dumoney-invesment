
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { TransactionsTable } from "@/components/admin/TransactionsTable";
import { ReferralAgentsChart } from "@/components/admin/ReferralAgentsChart";
import { ActiveUsersOverview } from "@/components/admin/ActiveUsersOverview";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setCurrentTab(tab);
    } else {
      setCurrentTab("dashboard");
    }
  }, [location.search]);
  
  const isAdmin = true;
  
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4 text-gray-400">You don't have permission to access the admin panel.</p>
        <button 
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          Return to App
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">
      {/* Mobile sidebar trigger */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="fixed bottom-4 right-4 z-50 bg-amber-500 p-3 rounded-full shadow-lg"
        >
          <span className="sr-only">Toggle Sidebar</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <div className={`${
        isMobile
          ? `fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`
          : 'w-64'
      }`}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-7xl mx-auto space-y-6">
            {currentTab === "dashboard" && (
              <>
                <h1 className="text-xl md:text-2xl font-bold text-gray-100">Admin Dashboard</h1>
                <DashboardOverview />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                  <ReferralAgentsChart />
                  <ActiveUsersOverview />
                </div>
                
                <TransactionsTable />
              </>
            )}
            
            {currentTab === "transactions" && (
              <>
                <h1 className="text-2xl font-bold text-gray-100">Transactions Management</h1>
                <TransactionsTable />
              </>
            )}
            
            {currentTab === "users" && (
              <div>
                <h1 className="text-2xl font-bold text-gray-100">User Management</h1>
                <p className="text-gray-400 mt-4">Full user management features coming soon.</p>
              </div>
            )}
            
            {currentTab === "referrals" && (
              <>
                <h1 className="text-2xl font-bold text-gray-100">Referral Program</h1>
                <ReferralAgentsChart />
              </>
            )}
            
            {currentTab === "activity" && (
              <>
                <h1 className="text-2xl font-bold text-gray-100">User Activity</h1>
                <ActiveUsersOverview />
              </>
            )}
            
            {currentTab === "settings" && (
              <div>
                <h1 className="text-2xl font-bold text-gray-100">Admin Settings</h1>
                <p className="text-gray-400 mt-4">System settings panel coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
