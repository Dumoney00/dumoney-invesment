
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import AdminDepositsPanel from '@/components/admin/deposits/AdminDepositsPanel';
import AdminWithdrawalsPanel from '@/components/admin/withdrawals/AdminWithdrawalsPanel';
import AdminReferralsPanel from '@/components/admin/referrals/AdminReferralsPanel';

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("deposits");

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/admin-login');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <Tabs defaultValue="deposits" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 bg-[#1A1F2C]/80 mb-6 p-1 rounded-lg">
            <TabsTrigger 
              value="deposits" 
              className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
            >
              Deposits
            </TabsTrigger>
            <TabsTrigger 
              value="withdrawals" 
              className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
            >
              Withdrawals
            </TabsTrigger>
            <TabsTrigger 
              value="referrals" 
              className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
            >
              Referrals
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposits">
            <AdminDepositsPanel />
          </TabsContent>
          
          <TabsContent value="withdrawals">
            <AdminWithdrawalsPanel />
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
