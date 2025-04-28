
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import TransactionHistory from "@/components/admin/TransactionHistory";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAllUserTransactions } from "@/hooks/useAllUserTransactions";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { users, transactions } = useAllUserTransactions();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/');
    }
    
    if (!user) {
      navigate('/admin-login');
    }
  }, [user, navigate]);

  // If no user or not admin, redirect to login
  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  // Calculate total users
  const totalUsers = users.length;
  
  // Calculate total deposits and withdrawals
  const depositTransactions = transactions.filter(tx => tx.type === 'deposit' && tx.status === 'completed');
  const withdrawalTransactions = transactions.filter(tx => tx.type === 'withdraw');
  
  const totalDeposits = depositTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalWithdrawals = withdrawalTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  
  // Calculate pending withdrawals
  const pendingWithdrawals = withdrawalTransactions.filter(tx => tx.status === 'pending');
  const pendingWithdrawalAmount = pendingWithdrawals.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-[#1A1F2C] border-gray-800 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1A1F2C] border-gray-800 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Deposits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹{totalDeposits.toLocaleString()}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1A1F2C] border-gray-800 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Withdrawals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹{totalWithdrawals.toLocaleString()}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1A1F2C] border-gray-800 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Pending Withdrawals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹{pendingWithdrawalAmount.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">{pendingWithdrawals.length} requests</p>
            </CardContent>
          </Card>
        </div>
        
        <TransactionHistory />
      </main>
    </div>
  );
};

export default AdminDashboard;
