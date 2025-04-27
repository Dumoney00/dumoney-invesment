
import React, { useState, useEffect } from 'react';
import { User, TransactionRecord } from '@/types/auth';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { formatDate } from '@/utils/dateUtils';
import TransactionTypeLabel from '@/components/transaction/TransactionTypeLabel';
import TransactionStatus from '@/components/transaction/TransactionStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/utils/toastUtils';

interface UserDetailsProps {
  userId: string;
  onClose: () => void;
}

const AdminUserDetails: React.FC<UserDetailsProps> = ({ userId, onClose }) => {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { loginAsUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserDetails = () => {
      try {
        // Get all users from localStorage
        const storedUsers = localStorage.getItem('investmentUsers');
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const user = users.find((u: User) => u.id === userId);
          
          if (user) {
            setUserDetails(user);
          } else {
            showToast("User Not Found", "Could not find user details", "destructive");
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        showToast("Error", "Could not load user details", "destructive");
        setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, [userId]);

  const handleLoginAsUser = async () => {
    if (!userDetails) return;
    
    const success = await loginAsUser(userDetails);
    if (success) {
      showToast("Success", `Logged in as ${userDetails.username}`, "default");
      navigate('/');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">Loading user details...</p>
      </div>
    );
  }
  
  if (!userDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-red-400 mb-4">User not found</p>
        <Button onClick={onClose} variant="outline">
          <ArrowLeft className="mr-2" size={16} />
          Back to Users List
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-[#222222] rounded-lg p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button 
            onClick={onClose}
            variant="ghost"
            className="text-gray-400 hover:text-white mr-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <h2 className="text-xl text-white font-bold">User Details</h2>
        </div>
        
        <Button 
          onClick={handleLoginAsUser}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <LogIn size={16} className="mr-2" />
          Login as User
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-[#333333] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <dl className="space-y-2">
              <div className="grid grid-cols-3">
                <dt className="text-gray-400">User ID:</dt>
                <dd className="col-span-2">{userDetails.id}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-gray-400">Username:</dt>
                <dd className="col-span-2">{userDetails.username}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-gray-400">Email:</dt>
                <dd className="col-span-2">{userDetails.email}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-gray-400">Phone:</dt>
                <dd className="col-span-2">{userDetails.phone || 'Not provided'}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-gray-400">Status:</dt>
                <dd className="col-span-2">
                  <span className={`px-2 py-1 text-xs rounded ${userDetails.isBlocked ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                    {userDetails.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card className="bg-[#333333] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Financial Information</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <dl className="space-y-2">
              <div className="grid grid-cols-3">
                <dt className="text-gray-400">Balance:</dt>
                <dd className="col-span-2">₹{userDetails.balance?.toLocaleString() || '0.00'}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-gray-400">Withdrawal Balance:</dt>
                <dd className="col-span-2">₹{userDetails.withdrawalBalance?.toLocaleString() || '0.00'}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-gray-400">Total Deposit:</dt>
                <dd className="col-span-2">₹{userDetails.totalDeposit?.toLocaleString() || '0.00'}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-gray-400">Total Withdraw:</dt>
                <dd className="col-span-2">₹{userDetails.totalWithdraw?.toLocaleString() || '0.00'}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-gray-400">Daily Income:</dt>
                <dd className="col-span-2">₹{userDetails.dailyIncome?.toLocaleString() || '0.00'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-[#333333] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Bank Details</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <dl className="space-y-2">
              <div className="grid grid-cols-3">
                <dt className="text-gray-400">Account Number:</dt>
                <dd className="col-span-2">{userDetails.bankDetails?.accountNumber || 'Not provided'}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-gray-400">IFSC Code:</dt>
                <dd className="col-span-2">{userDetails.bankDetails?.ifscCode || 'Not provided'}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-gray-400">Account Holder:</dt>
                <dd className="col-span-2">{userDetails.bankDetails?.accountHolderName || 'Not provided'}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-gray-400">UPI ID:</dt>
                <dd className="col-span-2">{userDetails.upiId || 'Not provided'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card className="bg-[#333333] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Investment Details</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <dl className="space-y-2">
              <div className="grid grid-cols-3">
                <dt className="text-gray-400">Investment Count:</dt>
                <dd className="col-span-2">{userDetails.investmentQuantity || 0}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-gray-400">Product IDs:</dt>
                <dd className="col-span-2">
                  {userDetails.ownedProducts && userDetails.ownedProducts.length > 0 ? 
                    userDetails.ownedProducts.map(product => product.productId).join(', ') : 
                    'No active investments'}
                </dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-gray-400">Referral Code:</dt>
                <dd className="col-span-2">{userDetails.referralCode || 'None'}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="text-gray-400">Level:</dt>
                <dd className="col-span-2">{userDetails.level || 0}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-[#333333] border-gray-700 mb-8">
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300">Transaction ID</TableHead>
                  <TableHead className="text-gray-300">Type</TableHead>
                  <TableHead className="text-gray-300 text-right">Amount</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userDetails.transactions && userDetails.transactions.length > 0 ? (
                  userDetails.transactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-white font-mono">{transaction.id.substring(0, 8)}</TableCell>
                      <TableCell>
                        <TransactionTypeLabel type={transaction.type} />
                      </TableCell>
                      <TableCell className="text-right text-white">
                        ₹{transaction.amount?.toLocaleString() || '0'}
                      </TableCell>
                      <TableCell className="text-white">
                        {formatDate(transaction.timestamp)}
                      </TableCell>
                      <TableCell>
                        <TransactionStatus status={transaction.status} />
                      </TableCell>
                      <TableCell className="text-white text-sm">
                        {transaction.details || 'No details'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                      No transactions found for this user
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {userDetails.transactions?.filter(t => t.type === 'withdraw').length > 0 && (
        <Card className="bg-[#333333] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Withdrawal Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">Transaction ID</TableHead>
                    <TableHead className="text-gray-300">Amount</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Bank Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userDetails.transactions
                    .filter(t => t.type === 'withdraw')
                    .map(transaction => (
                      <TableRow key={transaction.id}>
                        <TableCell className="text-white font-mono">{transaction.id.substring(0, 8)}</TableCell>
                        <TableCell className="text-white">
                          ₹{transaction.amount?.toLocaleString() || '0'}
                        </TableCell>
                        <TableCell className="text-white">
                          {formatDate(transaction.timestamp)}
                        </TableCell>
                        <TableCell>
                          <TransactionStatus status={transaction.status} />
                        </TableCell>
                        <TableCell className="text-white text-sm">
                          {transaction.bankDetails ? (
                            <>
                              <div>{transaction.bankDetails.accountHolderName}</div>
                              <div>{transaction.bankDetails.accountNumber}</div>
                              <div>{transaction.bankDetails.ifscCode}</div>
                            </>
                          ) : transaction.upiId ? (
                            <div>UPI: {transaction.upiId}</div>
                          ) : (
                            'No details'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminUserDetails;
