
import { UserCog, ShieldCheck, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { User } from '@/types/auth';

interface UserTableProps {
  users: User[];
  onBlockToggle: (userId: string, isCurrentlyBlocked: boolean) => Promise<void>;
  onViewDetails: (userId: string) => void;
  loading: boolean;
}

export const UserTable = ({ users, onBlockToggle, onViewDetails, loading }: UserTableProps) => {
  if (users.length === 0) {
    return (
      <TableRow className="border-[#33374D]">
        <TableCell colSpan={8} className="text-center py-8 text-gray-400">
          No users found matching your search criteria
        </TableCell>
      </TableRow>
    );
  }

  return (
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
        {users.map(user => (
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
                  onClick={() => onViewDetails(user.id)}
                >
                  <UserCog size={16} className="mr-1" /> Details
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={user.isBlocked ? 'text-green-400 hover:bg-green-500/10 hover:text-green-300' : 'text-red-400 hover:bg-red-500/10 hover:text-red-300'}
                  onClick={() => onBlockToggle(user.id, !!user.isBlocked)}
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
      </TableBody>
    </Table>
  );
};
