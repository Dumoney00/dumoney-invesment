
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminUsersPanel from '@/components/admin/AdminUsersPanel';
import AdminTransactionsPanel from '@/components/admin/AdminTransactionsPanel';
import AdminReferralsPanel from '@/components/admin/AdminReferralsPanel';
import AdminHeader from '@/components/admin/AdminHeader';

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

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
    <div className="min-h-screen bg-black">
      <AdminHeader />
      
      {/* Yellow Banner */}
      <div className="bg-investment-yellow h-2"></div>
      
      <div className="p-4">
        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 bg-[#333333] mb-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
          </TabsList>
          
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
    </div>
  );
};

export default AdminDashboard;
