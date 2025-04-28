
import { ArrowUpRight, ArrowDownRight, Users, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAllUserTransactions } from "@/hooks/useAllUserTransactions";

export const DashboardOverview = () => {
  const { transactions, users, loading } = useAllUserTransactions();
  
  // Calculate metrics
  const depositsCount = transactions.filter(t => t.type === 'deposit').length;
  const withdrawalsCount = transactions.filter(t => t.type === 'withdraw').length;
  const totalDeposits = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0);
  const activeUsers = users.filter(u => !u.isBlocked).length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  
  const stats = [
    {
      title: "Total Deposits",
      value: `₹${totalDeposits.toLocaleString()}`,
      description: `${depositsCount} deposits total`,
      icon: ArrowDownRight,
      iconClass: "text-emerald-500 bg-emerald-500/20"
    },
    {
      title: "Total Withdrawals",
      value: `₹${totalWithdrawals.toLocaleString()}`,
      description: `${withdrawalsCount} withdrawals total`,
      icon: ArrowUpRight,
      iconClass: "text-amber-500 bg-amber-500/20"
    },
    {
      title: "Active Users",
      value: activeUsers,
      description: `${users.length} total registered users`,
      icon: Users,
      iconClass: "text-blue-500 bg-blue-500/20"
    },
    {
      title: "Pending Requests",
      value: pendingTransactions,
      description: "Awaiting approval",
      icon: Clock,
      iconClass: "text-purple-500 bg-purple-500/20"
    }
  ];
  
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="bg-gray-800/50 border-gray-700">
            <CardHeader className="p-4">
              <div className="h-5 bg-gray-700 rounded w-24"></div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-8 bg-gray-700 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gray-800/50 backdrop-blur-md border-gray-700 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-gray-800/0 to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="p-4 pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
              <div className={`p-1.5 rounded-lg ${stat.iconClass}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <CardDescription className="text-gray-400">{stat.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
