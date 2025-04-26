
import { UserCog, ShieldCheck, Ban } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/types/auth';

interface UserStatsCardsProps {
  users: User[];
}

export const UserStatsCards = ({ users }: UserStatsCardsProps) => {
  const totalUsers = users.length;
  const activeUsers = users.filter(user => !user.isBlocked).length;
  const blockedUsers = users.filter(user => user.isBlocked).length;
  const totalInvestment = users.reduce((sum, user) => sum + user.balance, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-[#222B45]/80 border-[#33374D]">
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              <h3 className="text-2xl font-bold mt-1 text-white">{totalUsers}</h3>
            </div>
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <UserCog size={24} className="text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-[#222B45]/80 border-[#33374D]">
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Users</p>
              <h3 className="text-2xl font-bold mt-1 text-white">{activeUsers}</h3>
            </div>
            <div className="bg-green-500/20 p-2 rounded-lg">
              <ShieldCheck size={24} className="text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-[#222B45]/80 border-[#33374D]">
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-400">Blocked Users</p>
              <h3 className="text-2xl font-bold mt-1 text-white">{blockedUsers}</h3>
            </div>
            <div className="bg-red-500/20 p-2 rounded-lg">
              <Ban size={24} className="text-red-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-[#222B45]/80 border-[#33374D]">
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Investment</p>
              <h3 className="text-2xl font-bold mt-1 text-white">₹{totalInvestment.toLocaleString()}</h3>
            </div>
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <UserCog size={24} className="text-purple-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
