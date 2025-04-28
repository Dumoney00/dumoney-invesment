
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import DashboardOverview from '@/components/admin/dashboard/DashboardOverview';
import UsersPanel from '@/components/admin/users/UsersPanel';
import FinancialPanel from '@/components/admin/financial/FinancialPanel';
import ReferralPanel from '@/components/admin/referrals/ReferralPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAllUsers } from '@/hooks/useAllUsers';

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { users } = useAllUsers();

  // Protect admin route
  React.useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/admin-login');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
              value="financial" 
              className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
            >
              Financial
            </TabsTrigger>
            <TabsTrigger 
              value="referrals" 
              className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
            >
              Referrals
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <DashboardOverview users={users} />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersPanel />
          </TabsContent>
          
          <TabsContent value="financial">
            <FinancialPanel />
          </TabsContent>
          
          <TabsContent value="referrals">
            <ReferralPanel />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
