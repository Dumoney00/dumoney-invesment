
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
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  LineChart, 
  UserCheck,
  Calendar
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const userActivityData = [
  { name: 'Jan', users: 35, deposits: 48, withdrawals: 31 },
  { name: 'Feb', users: 42, deposits: 63, withdrawals: 52 },
  { name: 'Mar', users: 58, deposits: 77, withdrawals: 41 },
  { name: 'Apr', users: 71, deposits: 98, withdrawals: 63 },
  { name: 'May', users: 89, deposits: 112, withdrawals: 79 },
  { name: 'Jun', users: 103, deposits: 133, withdrawals: 91 }
];

const transactionData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const AdminOverviewPanel: React.FC = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users"
          value="1,287"
          change="+12.5%"
          trend="up"
          icon={UsersRound}
          iconColor="bg-blue-500"
          description="Total registered users"
        />
        <StatCard 
          title="Active Investors"
          value="832"
          change="+7.2%"
          trend="up"
          icon={UserCheck}
          iconColor="bg-green-500"
          description="Users with active investments"
        />
        <StatCard 
          title="Total Deposits"
          value="₹847,500"
          change="+23.1%"
          trend="up"
          icon={TrendingUp}
          iconColor="bg-purple-500"
          description="Total deposit amount"
        />
        <StatCard 
          title="Pending Withdrawals"
          value="₹114,230"
          change="-4.3%"
          trend="down"
          icon={DollarSign}
          iconColor="bg-amber-500"
          description="Awaiting approval"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#222B45]/80 border-[#33374D]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-white">User Activity</CardTitle>
              <CardDescription className="text-gray-400">
                New users, deposits and withdrawals
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
                  data={userActivityData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWithdrawals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
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
                  <Area type="monotone" dataKey="users" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorUsers)" />
                  <Area type="monotone" dataKey="deposits" stroke="#4CAF50" fillOpacity={1} fill="url(#colorDeposits)" />
                  <Area type="monotone" dataKey="withdrawals" stroke="#F97316" fillOpacity={1} fill="url(#colorWithdrawals)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center space-x-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#8B5CF6]"></div>
                <span className="text-sm text-gray-400">New Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#4CAF50]"></div>
                <span className="text-sm text-gray-400">Deposits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
                <span className="text-sm text-gray-400">Withdrawals</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#222B45]/80 border-[#33374D]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-white">Transaction Volume</CardTitle>
              <CardDescription className="text-gray-400">
                Daily transaction amounts
              </CardDescription>
            </div>
            <LineChart size={20} className="text-[#8B5CF6]" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={transactionData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#33374D" vertical={false} />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A1F2C', 
                      borderColor: '#33374D',
                      color: '#fff'
                    }}
                    formatter={(value) => [`₹${value}`, 'Amount']}
                  />
                  <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 bg-[#222B45]/80 border-[#33374D]">
          <CardHeader>
            <CardTitle className="text-white">Recent Activities</CardTitle>
            <CardDescription className="text-gray-400">
              Last 5 user activities across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem 
                title="Withdrawal Request" 
                description="User John Doe requested withdrawal of ₹5,000"
                time="10 minutes ago"
                icon={DollarSign}
                iconClass="bg-amber-500/20 text-amber-500"
              />
              <ActivityItem 
                title="New Registration" 
                description="New user Sarah Smith registered"
                time="35 minutes ago"
                icon={UsersRound}
                iconClass="bg-blue-500/20 text-blue-500"
              />
              <ActivityItem 
                title="Investment Made" 
                description="User Mike Johnson invested ₹10,000 in Gold Plan"
                time="1 hour ago"
                icon={TrendingUp}
                iconClass="bg-green-500/20 text-green-500"
              />
              <ActivityItem 
                title="Withdrawal Completed" 
                description="User Emily Brown's withdrawal of ₹3,500 completed"
                time="2 hours ago"
                icon={DollarSign}
                iconClass="bg-purple-500/20 text-purple-500"
              />
              <ActivityItem 
                title="Daily Income Generated" 
                description="System generated ₹27,890 in daily income across all users"
                time="6 hours ago"
                icon={LineChart}
                iconClass="bg-blue-500/20 text-blue-500"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#222B45]/80 border-[#33374D]">
          <CardHeader>
            <CardTitle className="text-white">Upcoming Tasks</CardTitle>
            <CardDescription className="text-gray-400">
              Actions requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <TaskItem 
                title="Review Withdrawal Requests"
                description="21 pending requests"
                dueDate="Today"
                priority="high"
              />
              <TaskItem 
                title="Approve New Investments"
                description="7 pending approvals"
                dueDate="Today"
                priority="medium"
              />
              <TaskItem 
                title="Update Investment Plans"
                description="Review and update rates"
                dueDate="Tomorrow"
                priority="low"
              />
              <TaskItem 
                title="Generate Monthly Report"
                description="Financial summary for June"
                dueDate="In 3 days"
                priority="medium"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  iconColor: string;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon: Icon, iconColor, description }) => {
  return (
    <Card className="bg-[#222B45]/80 border-[#33374D]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${iconColor}`}>
            <Icon size={22} className="text-white" />
          </div>
          {trend === 'up' ? (
            <div className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
              <ArrowUpRight size={14} />
              <span className="text-xs font-medium">{change}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-1 rounded-full">
              <ArrowDownRight size={14} />
              <span className="text-xs font-medium">{change}</span>
            </div>
          )}
        </div>
        <h3 className="text-2xl font-bold mt-4 text-white">{value}</h3>
        <p className="text-sm text-gray-400 mt-1">{title}</p>
        <p className="text-xs text-gray-500 mt-4">{description}</p>
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

const ActivityItem: React.FC<ActivityItemProps> = ({ title, description, time, icon: Icon, iconClass }) => {
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

interface TaskItemProps {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

const TaskItem: React.FC<TaskItemProps> = ({ title, description, dueDate, priority }) => {
  const priorityColors = {
    low: 'bg-blue-500/20 text-blue-500',
    medium: 'bg-amber-500/20 text-amber-500',
    high: 'bg-red-500/20 text-red-500',
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg bg-gray-700/20 mt-1`}>
        <Calendar size={16} className="text-gray-400" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-white">{title}</h4>
        <p className="text-xs text-gray-400">{description}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-gray-500">{dueDate}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${priorityColors[priority]}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPanel;
