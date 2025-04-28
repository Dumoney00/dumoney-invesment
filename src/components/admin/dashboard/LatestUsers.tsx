
import React from 'react';
import { User } from '@/types/auth';
import { formatDistanceToNow } from 'date-fns';
import { CalendarIcon, CheckCircle2, XCircle } from 'lucide-react';

interface LatestUsersProps {
  users: User[];
}

const LatestUsers: React.FC<LatestUsersProps> = ({ users }) => {
  // Function to estimate join date from user ID (in a real app this would come from the database)
  const getJoinDate = (id: string) => {
    // For demo purposes, create a random date in the past month
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    return date;
  };

  return (
    <div className="space-y-4">
      {users.length > 0 ? (
        users.map((user) => {
          const joinDate = getJoinDate(user.id);
          return (
            <div key={user.id} className="flex items-center gap-3 pb-3 border-b border-[#33374D] last:border-0">
              <div className="w-10 h-10 rounded-full bg-[#2A3248] flex items-center justify-center font-medium text-white">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.username}</p>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <CalendarIcon size={12} />
                  <span>Joined {formatDistanceToNow(joinDate, { addSuffix: true })}</span>
                </div>
              </div>
              {user.isBlocked ? (
                <XCircle size={16} className="text-red-400" />
              ) : (
                <CheckCircle2 size={16} className="text-green-400" />
              )}
            </div>
          );
        })
      ) : (
        <div className="text-center py-4 text-gray-500">No users found</div>
      )}
    </div>
  );
};

export default LatestUsers;
