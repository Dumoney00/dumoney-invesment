
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAllUsers } from '@/hooks/useAllUsers';
import { UserStatsCards } from './stats/UserStatsCards';
import { UserFilters } from './users/UserFilters';
import { UserTable } from './users/UserTable';
import AdminUserDetails from './AdminUserDetails';

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
        setUsers(users.map(user => 
          user.id === userId ? { ...user, isBlocked: !isCurrentlyBlocked } : user
        ));
      }
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="space-y-6">
      <UserStatsCards users={users} />
      
      <Card className="bg-[#222B45]/80 border-[#33374D]">
        <CardHeader className="pb-3">
          <CardTitle className="text-white">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <UserFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onFilterChange={setFilterStatus}
          />
          
          <div className="overflow-x-auto">
            <UserTable 
              users={filteredUsers}
              onBlockToggle={handleBlockToggle}
              onViewDetails={setSelectedUserId}
              loading={loading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPanel;
