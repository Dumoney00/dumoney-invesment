
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Ban, ShieldCheck, UserCog, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import AdminUserDetails from './AdminUserDetails';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAllUsers } from '@/hooks/useAllUsers';

const AdminUsersPanel: React.FC = () => {
  const { blockUser, unblockUser } = useAuth();
  const { users, setUsers, loading, setLoading } = useAllUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'blocked'>('all');

  // Filter users based on search term and filter status
  const filteredUsers = users.filter(user => {
    // First apply status filter
    if (filterStatus === 'active' && user.isBlocked) return false;
    if (filterStatus === 'blocked' && !user.isBlocked) return false;
    
    // Then apply search term
    return (
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false
    );
  });

  const handleBlockToggle = async (userId: string, isCurrentlyBlocked: boolean) => {
    setLoading(true);
    try {
      let success;
      if (isCurrentlyBlocked) {
        success = await unblockUser(userId);
      } else {
        success = await blockUser(userId);
      }
      
      if (success) {
        // Update local state for immediate UI update
        setUsers(users.map(user => 
          user.id === userId ? { ...user, isBlocked: !isCurrentlyBlocked } : user
        ));
      }
    } finally {
      setLoading(false);
    }
  };

  const viewUserDetails = (userId: string) => {
    setSelectedUserId(userId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">Loading users...</p>
      </div>
    );
  }

  if (selectedUserId) {
    return (
      <AdminUserDetails 
        userId={selectedUserId} 
        onClose={() => setSelectedUserId(null)} 
      />
    );
  }

  // User Stats
  const totalUsers = users.length;
  const activeUsers = users.filter(user => !user.isBlocked).length;
  const blockedUsers = users.filter(user => user.isBlocked).length;
  const totalInvestment = users.reduce((sum, user) => sum + user.balance, 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
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

      {/* User Table */}
      <Card className="bg-[#222B45]/80 border-[#33374D]">
        <CardHeader className="pb-3">
          <CardTitle className="text-white">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-[#1A1F2C] border-[#33374D] text-white pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-[#33374D] bg-[#1A1F2C] text-gray-400 hover:bg-[#33374D] hover:text-white"
                  >
                    <Filter size={18} className="mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#1A1F2C] border-[#33374D] text-white">
                  <DropdownMenuItem onClick={() => setFilterStatus('all')} className="hover:bg-[#33374D]">
                    All Users
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('active')} className="hover:bg-[#33374D]">
                    Active Users
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('blocked')} className="hover:bg-[#33374D]">
                    Blocked Users
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button className="bg-[#8B5CF6] text-white hover:bg-[#7B5CF6] w-full md:w-auto">
                Add New User
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#1A1F2C]/50">
                <TableRow className="border-[#33374D] hover:bg-[#1A1F2C]/70">
                  <TableHead className="text-gray-400">User ID</TableHead>
                  <TableHead className="text-gray-400">Username</TableHead>
                  <TableHead className="text-gray-400">Email</TableHead>
                  <TableHead className="text-gray-400">Phone</TableHead>
                  <TableHead className="text-gray-400">Balance (₹)</TableHead>
                  <TableHead className="text-gray-400">Level</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id} className="border-[#33374D] hover:bg-[#1A1F2C]/70">
                    <TableCell className="text-gray-300 font-mono">{user.id.substring(0, 8)}</TableCell>
                    <TableCell className="text-gray-300">{user.username}</TableCell>
                    <TableCell className="text-gray-300">{user.email}</TableCell>
                    <TableCell className="text-gray-300">{user.phone || 'N/A'}</TableCell>
                    <TableCell className="font-medium">
                      <div className="text-gray-300">{user.balance.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{user.withdrawalBalance.toLocaleString()} withdrawable</div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.level === 1 ? 'bg-blue-500/20 text-blue-400' : 
                        user.level === 2 ? 'bg-amber-500/20 text-amber-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        Level {user.level || 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.isBlocked 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                          onClick={() => viewUserDetails(user.id)}
                        >
                          <UserCog size={16} className="mr-1" /> Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={user.isBlocked ? 'text-green-400 hover:bg-green-500/10 hover:text-green-300' : 'text-red-400 hover:bg-red-500/10 hover:text-red-300'}
                          onClick={() => handleBlockToggle(user.id, !!user.isBlocked)}
                          disabled={loading}
                        >
                          {user.isBlocked ? (
                            <><ShieldCheck size={16} className="mr-1" /> Unblock</>
                          ) : (
                            <><Ban size={16} className="mr-1" /> Block</>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredUsers.length === 0 && (
                  <TableRow className="border-[#33374D]">
                    <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                      No users found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPanel;
