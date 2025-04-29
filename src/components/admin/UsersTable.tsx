
import { useState, useEffect } from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { useAllUserTransactions } from "@/hooks/useAllUserTransactions";
import { User } from "@/types/auth";
import { formatCurrency } from "@/utils/formatUtils";
import { formatDate } from "@/utils/dateUtils";
import { Check, X, Lock, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const UsersTable = () => {
  const { users, loading, refreshData } = useAllUserTransactions();
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  
  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const renderUserStatus = (isBlocked?: boolean) => {
    if (isBlocked) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
          <Lock className="h-3 w-3" />
          Blocked
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
          <UserCheck className="h-3 w-3" />
          Active
        </span>
      );
    }
  };
  
  const handleToggleUserStatus = async (userId: string, isCurrentlyBlocked: boolean | undefined) => {
    try {
      setUpdatingUserId(userId);
      
      const { error } = await supabase
        .from('users')
        .update({ is_blocked: !isCurrentlyBlocked })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: isCurrentlyBlocked ? "User Unblocked" : "User Blocked",
        description: isCurrentlyBlocked 
          ? "User can now access their account" 
          : "User is now blocked from accessing their account"
      });
      
      refreshData();
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast({
        title: "Operation Failed",
        description: "Could not update user status",
        variant: "destructive"
      });
    } finally {
      setUpdatingUserId(null);
    }
  };
  
  const handleViewDetails = (userId: string) => {
    // This would navigate to a user details page
    console.log("View details for user", userId);
    toast({
      title: "Coming Soon",
      description: "User details view will be implemented in a future update"
    });
  };
  
  if (loading) {
    return <div className="text-center py-10">Loading users...</div>;
  }
  
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900/50 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4 bg-gray-800/50">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium text-gray-200">Users</h3>
          <div className="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-1 rounded-full">
            {filteredUsers.length}
          </div>
        </div>
        
        <div className="relative">
          <input
            type="search"
            placeholder="Search users..."
            className="rounded-lg bg-gray-800 pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-gray-300 w-full sm:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-800/30">
            <TableRow className="hover:bg-transparent border-gray-700">
              <TableHead className="text-gray-400">User</TableHead>
              <TableHead className="text-gray-400">Email</TableHead>
              <TableHead className="text-gray-400 text-right">Balance</TableHead>
              <TableHead className="text-gray-400">Joined</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user: User) => (                
                <TableRow key={user.id} className="border-gray-700 hover:bg-gray-800/20">
                  <TableCell className="font-medium text-gray-300">
                    {user.username}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(user.balance)}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {user.lastIncomeCollection && formatDate(user.lastIncomeCollection)}
                  </TableCell>
                  <TableCell>
                    {renderUserStatus(user.isBlocked)}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => handleViewDetails(user.id)}
                    >
                      View
                    </Button>
                    <Button 
                      variant={user.isBlocked ? "default" : "destructive"} 
                      size="sm" 
                      className="text-xs"
                      disabled={updatingUserId === user.id}
                      onClick={() => handleToggleUserStatus(user.id, user.isBlocked)}
                    >
                      {updatingUserId === user.id 
                        ? "Updating..." 
                        : user.isBlocked 
                          ? "Unblock" 
                          : "Block"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-1 py-8 text-gray-400">
                    <p>No users found</p>
                    <p className="text-sm text-gray-500">Try changing the search query</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
