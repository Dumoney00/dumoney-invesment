
import React from 'react';
import { User } from '@/types/auth';
import { User as UserIcon } from 'lucide-react';

interface AccountStatsProps {
  user: User;
}

const AccountStats: React.FC<AccountStatsProps> = ({ user }) => {
  return (
    <div className="bg-[#222222] p-4 rounded-lg flex flex-col items-center mb-6">
      <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mb-2">
        <UserIcon size={20} className="text-blue-500" />
      </div>
      <p className="text-investment-gold text-xl font-bold">{user.username}</p>
      <p className="text-gray-400 text-xs">Account</p>
    </div>
  );
};

export default AccountStats;
