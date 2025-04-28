
import { Clock, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAllUserTransactions } from "@/hooks/useAllUserTransactions";
import { formatDate } from "@/utils/dateUtils";

export const ActiveUsersOverview = () => {
  const { users } = useAllUserTransactions();
  
  // Generate mock last activity timestamps
  const activeUsers = users.map(user => ({
    ...user,
    lastActivity: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString(),
  })).sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
  
  // Active users in the last hour (mock)
  const activeInLastHour = Math.floor(users.length * 0.4);
  
  return (
    <Card className="bg-gray-800/50 backdrop-blur-md border-gray-700">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-200">Active Users</CardTitle>
          <div className="flex items-center gap-1 bg-green-500/20 text-green-500 px-2 py-1 rounded-full text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>{activeInLastHour} Online</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Total Registered</div>
              <div className="text-2xl font-bold text-white">{users.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Active (24h)</div>
              <div className="text-2xl font-bold text-white">{Math.floor(users.length * 0.7)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">New Today</div>
              <div className="text-2xl font-bold text-white">{Math.floor(users.length * 0.2)}</div>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-400">Activity</div>
            <div className="flex gap-0.5">
              {Array.from({ length: 24 }).map((_, i) => {
                const height = Math.floor(Math.random() * 35) + 10;
                const isPeak = height > 30;
                
                return (
                  <div 
                    key={i} 
                    className="flex-1 rounded-t-sm" 
                    style={{ height: `${height}px` }}
                  >
                    <div 
                      className={`w-full h-full ${isPeak ? 'bg-amber-500' : 'bg-purple-600/70'}`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>00:00</span>
              <span>12:00</span>
              <span>23:59</span>
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-gray-400 mb-2">Recently Active</div>
            <div className="space-y-2 max-h-48 overflow-auto pr-2 custom-scrollbar">
              {activeUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-750 hover:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user.username.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-300">{user.username}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(user.lastActivity)}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-2 flex items-center justify-center gap-1 text-xs text-purple-400 hover:text-purple-300 py-1">
              <Eye className="h-3 w-3" />
              <span>View all users</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
