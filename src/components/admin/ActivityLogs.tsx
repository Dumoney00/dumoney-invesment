
import { useState, useEffect } from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  LogIn, 
  UserPlus, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  ShoppingCart, 
  DollarSign,
  Filter
} from "lucide-react";
import { useActivityLogs, ActivityLog } from "@/hooks/useActivityLogs";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

export const ActivityLogs = () => {
  const { user } = useAuth();
  const { activities, loading, error, fetchAllActivities, setupRealtimeSubscription } = useActivityLogs(user);
  const [filter, setFilter] = useState<string | null>(null);
  const [showAmount, setShowAmount] = useState<boolean>(true);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchAllActivities();
      const unsubscribe = setupRealtimeSubscription();
      return unsubscribe;
    }
  }, [user]);

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'login': return <LogIn className="h-4 w-4 text-blue-500" />;
      case 'register': return <UserPlus className="h-4 w-4 text-green-500" />;
      case 'deposit': return <ArrowDownCircle className="h-4 w-4 text-emerald-500" />;
      case 'withdraw': return <ArrowUpCircle className="h-4 w-4 text-amber-500" />;
      case 'purchase': return <ShoppingCart className="h-4 w-4 text-purple-500" />;
      case 'sale': return <DollarSign className="h-4 w-4 text-pink-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredActivities = filter 
    ? activities.filter(activity => activity.activity_type === filter)
    : activities;

  return (
    <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-white">Activity Logs</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAmount(!showAmount)}
              className="text-gray-400 hover:text-white"
            >
              {showAmount ? 'Hide Amounts' : 'Show Amounts'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex gap-1"
              onClick={() => setFilter(null)}
            >
              <Filter className="h-4 w-4" />
              {filter ? `Filtered: ${filter}` : 'All activities'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-800/50">
              <TableRow className="hover:bg-transparent border-gray-700">
                <TableHead className="text-gray-400 w-1/4">User</TableHead>
                <TableHead className="text-gray-400 w-1/6">Activity</TableHead>
                {showAmount && (
                  <TableHead className="text-gray-400 w-1/6 text-right">Amount</TableHead>
                )}
                <TableHead className="text-gray-400">Details</TableHead>
                <TableHead className="text-gray-400 w-1/6">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={showAmount ? 5 : 4} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-400">Loading activities...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredActivities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={showAmount ? 5 : 4} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Activity className="h-8 w-8 text-gray-500" />
                      <p className="text-gray-400">No activities found</p>
                      {filter && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setFilter(null)}
                          className="mt-2"
                        >
                          Clear filter
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredActivities.map((activity) => (
                  <TableRow key={activity.id} className="border-gray-700">
                    <TableCell className="font-medium text-gray-300">
                      {activity.username}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className="flex items-center gap-1 py-1"
                        onClick={() => setFilter(activity.activity_type)}
                      >
                        {getActivityIcon(activity.activity_type)}
                        <span className="capitalize">{activity.activity_type.replace('_', ' ')}</span>
                      </Badge>
                    </TableCell>
                    {showAmount && (
                      <TableCell className="text-right">
                        {activity.amount ? (
                          <span className={
                            activity.activity_type === 'deposit' || activity.activity_type === 'sale' 
                              ? 'text-emerald-500' 
                              : activity.activity_type === 'withdraw' || activity.activity_type === 'purchase'
                                ? 'text-amber-500'
                                : 'text-gray-300'
                          }>
                            {(activity.activity_type === 'deposit' || activity.activity_type === 'sale') && '+'}
                            {(activity.activity_type === 'withdraw' || activity.activity_type === 'purchase') && '-'}
                            ₹{activity.amount.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </TableCell>
                    )}
                    <TableCell className="text-gray-300">
                      {activity.details || <span className="text-gray-500">No details</span>}
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
