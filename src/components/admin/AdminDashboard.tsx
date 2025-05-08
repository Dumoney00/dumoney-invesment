
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';
import { useDashboardData } from '@/hooks/admin/useDashboardData';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardTabs from './dashboard/DashboardTabs';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  const {
    transactions,
    activities,
    stats,
    chartData,
    summaryStats,
    loading,
    fetchData,
    setupRealtimeSubscription
  } = useDashboardData();

  // Setup realtime subscription when component mounts
  useEffect(() => {
    const cleanup = setupRealtimeSubscription();
    return cleanup;
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const handleSignout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-investment-gold" />
        <p className="mt-2 text-investment-gold">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <DashboardHeader onRefresh={handleRefresh} onSignout={handleSignout} />
      
      <div className="container mx-auto p-4">
        <DashboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          summaryStats={summaryStats}
          chartData={chartData}
          transactions={transactions}
          activities={activities}
          stats={stats}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
