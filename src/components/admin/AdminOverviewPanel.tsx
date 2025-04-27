
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  UsersRound, 
  TrendingUp, 
  Download, 
  Upload,
  LineChart,
  UserCheck,
  Calendar
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAllUsers } from '@/hooks/useAllUsers';
import { useAllUserTransactions } from '@/hooks/useAllUserTransactions';
import { TransactionType } from '@/types/auth';

const AdminOverviewPanel: React.FC = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const { users } = useAllUsers();
  const { transactions } = useAllUserTransactions();
  
  // Calculate user statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => !u.isBlocked).length;
  const dailyActiveUsers = users.filter(u => 
    new Date(u.lastIncomeCollection || '').toDateString() === new Date().toDateString()
  ).length;

  // Calculate transaction statistics
  const totalDeposits = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  
  const getTodayTransactions = (type: TransactionType) => {
    const today = new Date().toDateString();
    return transactions.filter(t => 
      t.type === type && 
      new Date(t.timestamp).toDateString() === today
    ).length;
  };

  const todayDeposits = getTodayTransactions('deposit');
  const todayWithdrawals = getTodayTransactions('withdraw');
  const todayPurchases = getTodayTransactions('purchase');

  // Get transactions for the last 7 days
  const getLast7DaysData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayTransactions = transactions.filter(t => 
        new Date(t.timestamp).toDateString() === date.toDateString()
      );

      data.push({
        name: dateStr,
        deposits: dayTransactions.filter(t => t.type === 'deposit').length,
        withdrawals: dayTransactions.filter(t => t.type === 'withdraw').length,
        purchases: dayTransactions.filter(t => t.type === 'purchase').length
      });
    }
    return data;
  };

  const activityData = getLast7DaysData();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users"
          value={totalUsers.toString()}
          subtitle={`${activeUsers} active`}
          trend="up"
          icon={UsersRound}
          iconColor="bg-blue-500"
        />
        <StatCard 
          title="Today's Activity"
          value={`${todayDeposits + todayWithdrawals + todayPurchases}`}
          subtitle="Total transactions"
          trend="up"
          icon={LineChart}
          iconColor="bg-green-500"
        />
        <StatCard 
          title="Total Deposits"
          value={`₹${totalDeposits.toLocaleString()}`}
          subtitle={`${todayDeposits} today`}
          trend="up"
          icon={Download}
          iconColor="bg-purple-500"
        />
        <StatCard 
          title="Total Withdrawals"
          value={`₹${totalWithdrawals.toLocaleString()}`}
          subtitle={`${todayWithdrawals} today`}
          trend="up"
          icon={Upload}
          iconColor="bg-amber-500"
        />
      </div>

      {/* Activity Chart */}
      <Card className="bg-[#222B45]/80 border-[#33374D]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-white">Real-time Activity</CardTitle>
            <CardDescription className="text-gray-400">
              User transactions and activity over time
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <button 
              onClick={() => setTimeRange('weekly')}
              className={`px-3 py-1 rounded ${timeRange === 'weekly' ? 'bg-[#8B5CF6] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Weekly
            </button>
            <button 
              onClick={() => setTimeRange('monthly')}
              className={`px-3 py-1 rounded ${timeRange === 'monthly' ? 'bg-[#8B5CF6] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Monthly
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activityData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorWithdrawals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#33374D" vertical={false} />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1F2C', 
                    borderColor: '#33374D',
                    color: '#fff'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="deposits" 
                  stroke="#4CAF50" 
                  fillOpacity={1} 
                  fill="url(#colorDeposits)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="withdrawals" 
                  stroke="#F97316" 
                  fillOpacity={1} 
                  fill="url(#colorWithdrawals)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="purchases" 
                  stroke="#8B5CF6" 
                  fillOpacity={1} 
                  fill="url(#colorPurchases)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center space-x-8 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#4CAF50]"></div>
              <span className="text-sm text-gray-400">Deposits</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
              <span className="text-sm text-gray-400">Withdrawals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#8B5CF6]"></div>
              <span className="text-sm text-gray-400">Purchases</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Feed */}
      <Card className="bg-[#222B45]/80 border-[#33374D]">
        <CardHeader>
          <CardTitle className="text-white">Real-time Activity Feed</CardTitle>
          <CardDescription className="text-gray-400">
            Latest user activities across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions
              .slice(0, 5)
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((transaction, index) => (
                <ActivityItem 
                  key={transaction.id}
                  title={`${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}`}
                  description={`${transaction.userName || 'User'} - ₹${transaction.amount}`}
                  time={new Date(transaction.timestamp).toLocaleString()}
                  icon={getTransactionIcon(transaction.type)}
                  iconClass={getTransactionIconClass(transaction.type)}
                />
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper components
interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle,
  icon: Icon, 
  iconColor 
}) => {
  return (
    <Card className="bg-[#222B45]/80 border-[#33374D]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-white">{value}</h3>
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          </div>
          <div className={`p-2 rounded-lg ${iconColor}`}>
            <Icon size={22} className="text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
  iconClass: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ 
  title, 
  description, 
  time, 
  icon: Icon, 
  iconClass 
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${iconClass} mt-1`}>
        <Icon size={16} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-white">{title}</h4>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <div className="text-xs text-gray-500">{time}</div>
    </div>
  );
};

// Helper functions
const getTransactionIcon = (type: TransactionType) => {
  switch (type) {
    case 'deposit':
      return Download;
    case 'withdraw':
      return Upload;
    case 'purchase':
      return TrendingUp;
    default:
      return LineChart;
  }
};

const getTransactionIconClass = (type: TransactionType) => {
  switch (type) {
    case 'deposit':
      return 'bg-green-500/20 text-green-500';
    case 'withdraw':
      return 'bg-amber-500/20 text-amber-500';
    case 'purchase':
      return 'bg-purple-500/20 text-purple-500';
    default:
      return 'bg-blue-500/20 text-blue-500';
  }
};

export default AdminOverviewPanel;
