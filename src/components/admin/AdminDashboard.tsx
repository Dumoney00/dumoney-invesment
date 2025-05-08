
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TransactionTable } from "@/components/admin/TransactionTable";
import { UserStatsTable } from "@/components/admin/UserStatsTable";
import { ActivityStream } from "@/components/admin/ActivityStream";
import { UserActivity, TransactionSummary } from "@/types/admin";

import { 
  ArrowLeftRight, 
  Users, 
  LogOut, 
  BarChart3,
  Activity,
  RefreshCw,
  Wallet
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [stats, setStats] = useState<TransactionSummary[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [summaryStats, setSummaryStats] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalUsers: 0,
    activeUsers: 0,
  });

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
    setupRealtimeSubscription();
  }, []);

  // Initial data fetching
  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchTransactions(),
        fetchActivities(),
        fetchUserStats(),
        fetchSummaryStats()
      ]);

      // Generate chart data
      generateChartData();
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Set up realtime subscription
  const setupRealtimeSubscription = () => {
    const transactionsChannel = supabase
      .channel('admin-transaction-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transactions'
      }, async () => {
        console.log('Realtime transaction update detected');
        await fetchTransactions();
        await fetchSummaryStats();
        generateChartData();
      })
      .subscribe();

    const activitiesChannel = supabase
      .channel('admin-activity-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'activity_logs'
      }, async () => {
        console.log('Realtime activity update detected');
        await fetchActivities();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(transactionsChannel);
      supabase.removeChannel(activitiesChannel);
    };
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching transactions:", error);
    } else {
      setTransactions(data || []);
    }
  };

  // Fetch activities
  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching activities:", error);
    } else {
      setActivities(data as UserActivity[] || []);
    }
  };

  // Fetch user stats
  const fetchUserStats = async () => {
    const { data, error } = await supabase
      .from('admin_transaction_summary')
      .select('*');

    if (error) {
      console.error("Error fetching user stats:", error);
    } else {
      setStats(data as TransactionSummary[] || []);
    }
  };

  // Fetch summary stats
  const fetchSummaryStats = async () => {
    try {
      // Get total users
      const { count: userCount, error: userError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get active users (users who logged in in the last 7 days)
      const { count: activeCount, error: activeError } = await supabase
        .from('activity_logs')
        .select('*', { count: 'exact', head: true })
        .eq('activity_type', 'login')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Get total deposits and withdrawals
      const { data: totals, error: totalsError } = await supabase
        .rpc('get_transaction_totals');

      if (userError || activeError || totalsError) {
        throw new Error("Error fetching summary stats");
      }

      setSummaryStats({
        totalUsers: userCount || 0,
        activeUsers: activeCount || 0,
        totalDeposits: (totals && totals.total_deposits) || 0,
        totalWithdrawals: (totals && totals.total_withdrawals) || 0,
      });
    } catch (error) {
      console.error("Error fetching summary stats:", error);
    }
  };

  // Generate chart data based on transactions
  const generateChartData = () => {
    // Group transactions by date and calculate daily deposits/withdrawals
    const last30Days = new Array(30).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyData = last30Days.map(date => {
      const dayTransactions = transactions.filter(t => 
        t.timestamp.split('T')[0] === date
      );
      
      const deposits = dayTransactions
        .filter(t => t.type === 'deposit' && t.status === 'completed')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
      const withdrawals = dayTransactions
        .filter(t => t.type === 'withdraw' && t.status === 'completed')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
      return {
        date,
        deposits,
        withdrawals
      };
    });

    setChartData(dailyData);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleSignout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-[#191919] border-b border-gray-800 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-investment-gold text-2xl font-bold">Admin Dashboard</h1>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCw size={16} className="mr-1" />
              Refresh
            </Button>
            
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleSignout}
            >
              <LogOut size={16} className="mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto p-4">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-[#191919] border border-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-investment-gold data-[state=active]:text-black">
              <BarChart3 size={16} className="mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-investment-gold data-[state=active]:text-black">
              <ArrowLeftRight size={16} className="mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-investment-gold data-[state=active]:text-black">
              <Users size={16} className="mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-investment-gold data-[state=active]:text-black">
              <Activity size={16} className="mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-[#191919] border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-400">Total Deposits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Wallet className="h-5 w-5 text-green-500 mr-2" />
                      <div className="text-2xl font-bold text-white">₹{summaryStats.totalDeposits.toLocaleString()}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#191919] border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-400">Total Withdrawals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Wallet className="h-5 w-5 text-amber-500 mr-2" />
                      <div className="text-2xl font-bold text-white">₹{summaryStats.totalWithdrawals.toLocaleString()}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#191919] border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-400">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-blue-500 mr-2" />
                      <div className="text-2xl font-bold text-white">{summaryStats.totalUsers}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#191919] border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-400">Active Users (7d)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 text-purple-500 mr-2" />
                      <div className="text-2xl font-bold text-white">{summaryStats.activeUsers}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-[#191919] border-gray-800 mb-6">
                <CardHeader>
                  <CardTitle>Transactions (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorWithdrawals" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="date" 
                          stroke="#525252"
                          tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                        />
                        <YAxis stroke="#525252" />
                        <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#191919', border: '1px solid #333' }}
                          formatter={(value) => [`₹${value}`, undefined]}
                          labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="deposits" 
                          name="Deposits" 
                          stroke="#4ade80" 
                          fillOpacity={1} 
                          fill="url(#colorDeposits)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="withdrawals" 
                          name="Withdrawals" 
                          stroke="#f59e0b" 
                          fillOpacity={1} 
                          fill="url(#colorWithdrawals)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[#191919] border-gray-800">
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TransactionTable 
                      transactions={transactions.slice(0, 5)} 
                      compact={true}
                    />
                    
                    <div className="mt-4 flex justify-center">
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('transactions')}
                      >
                        View All Transactions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#191919] border-gray-800">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ActivityStream 
                      activities={activities.slice(0, 5)}
                      compact={true}
                    />
                    
                    <div className="mt-4 flex justify-center">
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('activity')}
                      >
                        View All Activity
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="transactions">
              <Card className="bg-[#191919] border-gray-800">
                <CardHeader>
                  <CardTitle>All Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionTable transactions={transactions} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users">
              <Card className="bg-[#191919] border-gray-800">
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <UserStatsTable stats={stats} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card className="bg-[#191919] border-gray-800">
                <CardHeader>
                  <CardTitle>User Activity Stream</CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityStream activities={activities} />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
