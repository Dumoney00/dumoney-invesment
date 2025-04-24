
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import AdminUsersPanel from '@/components/admin/AdminUsersPanel';
import AdminTransactionsPanel from '@/components/admin/AdminTransactionsPanel';
import AdminReferralsPanel from '@/components/admin/AdminReferralsPanel';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import AdminOverviewPanel from '@/components/admin/AdminOverviewPanel';

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/admin-login');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user?.isAdmin) {
    return null; // Don't render anything while redirecting
  }

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 bg-[#1A1F2C]/80 mb-6 p-1 rounded-lg">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
            >
              Transactions
            </TabsTrigger>
            <TabsTrigger 
              value="referrals" 
              className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
            >
              Referrals
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <AdminOverviewPanel />
          </TabsContent>
          
          <TabsContent value="users">
            <AdminUsersPanel />
          </TabsContent>
          
          <TabsContent value="transactions">
            <AdminTransactionsPanel />
          </TabsContent>
          
          <TabsContent value="referrals">
            <AdminReferralsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
