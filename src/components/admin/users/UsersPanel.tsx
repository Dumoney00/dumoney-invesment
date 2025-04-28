
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTable } from './UserTable';
import { UserFilters } from './UserFilters';
import { useAllUsers } from '@/hooks/useAllUsers';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const UsersPanel: React.FC = () => {
  const { users, loading } = useAllUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'blocked'>('all');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { blockUser, unblockUser } = useAuth();
  const { toast } = useToast();
  
  // Filter users based on search term and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && !user.isBlocked) ||
      (filterStatus === 'blocked' && user.isBlocked);
      
    return matchesSearch && matchesStatus;
  });
  
  const handleBlockToggle = async (userId: string, isCurrentlyBlocked: boolean) => {
    try {
      let success;
      
      if (isCurrentlyBlocked) {
        success = await unblockUser(userId);
        if (success) {
          toast({
            title: "User Unblocked",
            description: "User has been unblocked successfully",
          });
        }
      } else {
        success = await blockUser(userId);
        if (success) {
          toast({
            title: "User Blocked",
            description: "User has been blocked successfully",
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: "There was an error processing your request",
      });
    }
  };
  
  const handleViewDetails = (userId: string) => {
    setSelectedUserId(userId);
    setIsDialogOpen(true);
  };
  
  const selectedUser = selectedUserId ? users.find(user => user.id === selectedUserId) : null;

  return (
    <div className="space-y-6">
      <Card className="bg-[#222B45]/80 border-[#33374D]">
        <CardHeader>
          <CardTitle className="text-white">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <UserFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={filterStatus}
            onStatusFilterChange={setFilterStatus}
          />
          
          <div className="mt-4 overflow-x-auto">
            <UserTable 
              users={filteredUsers}
              onBlockToggle={handleBlockToggle}
              onViewDetails={handleViewDetails}
              loading={loading}
            />
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#222B45] text-white border-[#33374D] max-w-3xl">
          {selectedUser && (
            <div>
              <h2 className="text-xl font-semibold mb-4">User Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-400">Username</p>
                    <p className="font-medium">{selectedUser.username}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="font-medium">{selectedUser.phone || 'Not provided'}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-400">Status</p>
                    <p className={selectedUser.isBlocked ? 'text-red-400' : 'text-green-400'}>
                      {selectedUser.isBlocked ? 'Blocked' : 'Active'}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-400">Balance</p>
                    <p className="font-medium">₹{selectedUser.balance.toLocaleString()}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-400">Withdrawable Balance</p>
                    <p className="font-medium">₹{selectedUser.withdrawalBalance.toLocaleString()}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-400">Total Deposits</p>
                    <p className="font-medium">₹{selectedUser.totalDeposit.toLocaleString()}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-400">Total Withdrawals</p>
                    <p className="font-medium">₹{selectedUser.totalWithdraw.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPanel;
