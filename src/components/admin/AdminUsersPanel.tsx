
import React, { useState } from 'react';
import { User } from '@/types/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Ban, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

// Mock data for development - in a real app this would come from API/database
const mockUsers: User[] = [
  {
    id: 'usr_123',
    username: 'john_doe',
    email: 'john@example.com',
    phone: '9182475123',
    balance: 500,
    withdrawalBalance: 100,
    totalDeposit: 1000,
    totalWithdraw: 400,
    dailyIncome: 35,
    investmentQuantity: 2,
    ownedProducts: [1, 2],
    isBlocked: false,
    referralCode: 'JOHN123',
    level: 2
  },
  {
    id: 'usr_456',
    username: 'jane_smith',
    email: 'jane@example.com',
    phone: '9182475456',
    balance: 1200,
    withdrawalBalance: 300,
    totalDeposit: 1500,
    totalWithdraw: 200,
    dailyIncome: 50,
    investmentQuantity: 3,
    ownedProducts: [1, 3, 4],
    isBlocked: true,
    referralCode: 'JANE456',
    level: 1
  }
];

const AdminUsersPanel: React.FC = () => {
  const { blockUser, unblockUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="bg-[#222222] rounded-lg p-4">
      <div className="flex items-center gap-3 mb-6">
        <Input
          placeholder="Search users by name, email or ID"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-[#333333] border-gray-700 text-white"
        />
        <Button variant="ghost" className="text-gray-400">
          <Search size={18} />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">User ID</TableHead>
              <TableHead className="text-gray-300">Username</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Balance</TableHead>
              <TableHead className="text-gray-300">Level</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell className="text-white">{user.id.substring(0, 8)}</TableCell>
                <TableCell className="text-white">{user.username}</TableCell>
                <TableCell className="text-white">{user.email}</TableCell>
                <TableCell className="text-white">
                  ${user.balance.toFixed(2)} / ${user.withdrawalBalance.toFixed(2)}
                </TableCell>
                <TableCell className="text-white">{user.level || 0}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded ${user.isBlocked ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={user.isBlocked ? 'text-green-500' : 'text-red-500'}
                    onClick={() => handleBlockToggle(user.id, !!user.isBlocked)}
                    disabled={loading}
                  >
                    {user.isBlocked ? (
                      <><ShieldCheck size={16} className="mr-1" /> Unblock</>
                    ) : (
                      <><Ban size={16} className="mr-1" /> Block</>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                  No users found matching your search criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsersPanel;
