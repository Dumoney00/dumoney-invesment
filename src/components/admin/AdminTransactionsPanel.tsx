
import React, { useState, useEffect } from 'react';
import { TransactionRecord, User } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Check, Filter, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { showToast } from '@/utils/toastUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TransactionStatsCard from './stats/TransactionStatsCard';
import TransactionFilters from './transactions/TransactionFilters';
import TransactionTable from './transactions/TransactionTable';

// Helper function to extract all transactions from all users
const extractAllTransactions = (users: User[]): TransactionRecord[] => {
  const transactions: TransactionRecord[] = [];
  
  users.forEach(user => {
    if (user.transactions && user.transactions.length > 0) {
      // Add user information to each transaction
      const userTransactions = user.transactions.map(transaction => ({
        ...transaction,
        userId: user.id,
        userName: user.username
      }));
      transactions.push(...userTransactions);
    }
  });
  
  // Sort by timestamp, newest first
  return transactions.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Mock users data - in a real app, this would come from a database
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
    referredBy: 'usr_789',
    level: 2,
    transactions: [
      {
        id: 'trx_101',
        type: 'deposit',
        amount: 500,
        timestamp: new Date(Date.now() - 100000).toISOString(),
        status: 'completed',
        details: 'Deposit via bank transfer'
      },
      {
        id: 'trx_102',
        type: 'purchase',
        amount: 200,
        timestamp: new Date(Date.now() - 200000).toISOString(),
        status: 'completed',
        details: 'Investment in Silver Plan',
        productId: 2,
        productName: 'Silver Investment Plan'
      }
    ]
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
    level: 1,
    transactions: [
      {
        id: 'trx_201',
        type: 'withdraw',
        amount: 150,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'pending',
        details: 'Withdrawal to UPI',
        upiId: 'jane@upi',
        withdrawalTime: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'trx_202',
        type: 'dailyIncome',
        amount: 50,
        timestamp: new Date(Date.now() - 150000).toISOString(),
        status: 'completed',
        details: 'Daily income added to withdrawal wallet'
      }
    ]
  },
  {
    id: 'usr_789',
    username: 'robert_johnson',
    email: 'robert@example.com',
    phone: '9182475789',
    balance: 2500,
    withdrawalBalance: 600,
    totalDeposit: 3000,
    totalWithdraw: 450,
    dailyIncome: 75,
    investmentQuantity: 4,
    ownedProducts: [2, 4, 5, 6],
    isBlocked: false,
    referralCode: 'ROBERT789',
    level: 3,
    transactions: [
      {
        id: 'trx_301',
        type: 'referralBonus',
        amount: 100,
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'completed',
        details: 'Referral bonus for new user'
      },
      {
        id: 'trx_302',
        type: 'withdraw',
        amount: 800,
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        status: 'pending',
        details: 'Withdrawal to bank account',
        bankDetails: {
          accountNumber: 'XXXX5678',
          ifscCode: 'EFGH0005678',
          accountHolderName: 'Robert Johnson'
        },
        withdrawalTime: new Date(Date.now() - 172800000).toISOString()
      }
    ]
  }
];

const AdminTransactionsPanel: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [isApproving, setIsApproving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Load transactions from all users
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchTransactions = async () => {
      setLoadingData(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get actual user transaction data if available
        const storedUsers = localStorage.getItem('investmentUsers');
        let allUsers: User[] = [];
        
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers) as User[];
          allUsers = parsedUsers;
        } else {
          // Fallback to mock data if no real users are available
          allUsers = mockUsers;
        }
        
        // Also include the current logged-in user if they have transactions
        const currentUser = localStorage.getItem('investmentUser');
        if (currentUser) {
          const parsedUser = JSON.parse(currentUser) as User;
          
          // Only add if not already in the list
          if (parsedUser.transactions && !allUsers.some(u => u.id === parsedUser.id)) {
            allUsers.push(parsedUser);
          }
        }
        
        // Extract all transactions
        const allTransactions = extractAllTransactions(allUsers);
        setTransactions(allTransactions);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    if (filter !== 'all' && transaction.type !== filter) {
      return false;
    }
    
    if (statusFilter !== 'all' && transaction.status !== statusFilter) {
      return false;
    }
    
    return (
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false
    );
  });

  const handleSelectTransaction = (transactionId: string) => {
    setSelectedTransactions(prev => {
      if (prev.includes(transactionId)) {
        return prev.filter(id => id !== transactionId);
      }
      return [...prev, transactionId];
    });
  };

  const handleSelectAll = () => {
    if (selectedTransactions.length === pendingWithdrawals.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(pendingWithdrawals.map(t => t.id));
    }
  };

  const handleApproveWithdrawals = async () => {
    setIsApproving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTransactions(prevTransactions => 
        prevTransactions.map(transaction => {
          if (selectedTransactions.includes(transaction.id)) {
            return {
              ...transaction,
              status: 'completed',
              approvedBy: user?.id,
              approvalTimestamp: new Date().toISOString()
            };
          }
          return transaction;
        })
      );
      
      // In a real app, we would update the user's transactions in storage here as well
      
      showToast(
        "Withdrawals Approved",
        `Successfully approved ${selectedTransactions.length} withdrawal requests`
      );
      setSelectedTransactions([]);
    } catch (error) {
      showToast(
        "Approval Failed",
        "Could not approve withdrawals",
        "destructive"
      );
    } finally {
      setIsApproving(false);
    }
  };

  const pendingWithdrawals = filteredTransactions.filter(
    t => t.type === 'withdraw' && t.status === 'pending'
  );

  const totalTransactions = transactions.length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  const totalDeposits = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <TransactionStatsCard
          title="Total Transactions"
          value={totalTransactions}
          icon={Filter}
          iconColorClass="bg-blue-500/20 text-blue-500"
        />
        <TransactionStatsCard
          title="Pending Approvals"
          value={pendingTransactions}
          icon={Check}
          iconColorClass="bg-amber-500/20 text-amber-500"
        />
        <TransactionStatsCard
          title="Total Deposits"
          value={`₹${totalDeposits.toLocaleString()}`}
          icon={Download}
          iconColorClass="bg-green-500/20 text-green-500"
        />
        <TransactionStatsCard
          title="Total Withdrawals"
          value={`₹${totalWithdrawals.toLocaleString()}`}
          icon={Download}
          iconColorClass="bg-purple-500/20 text-purple-500"
        />
      </div>

      <Card className="bg-[#222B45]/80 border-[#33374D]">
        <CardHeader className="pb-3">
          <CardTitle className="text-white">Transaction Management</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionFilters
            searchTerm={searchTerm}
            filter={filter}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onFilterChange={setFilter}
            onStatusFilterChange={setStatusFilter}
          />
          
          {pendingWithdrawals.length > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <span className="text-gray-400 text-sm">
                {selectedTransactions.length} selected
              </span>
              <Button
                onClick={handleApproveWithdrawals}
                disabled={selectedTransactions.length === 0 || isApproving}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check size={16} className="mr-2" />
                {isApproving ? "Processing..." : "Approve Selected"}
              </Button>
            </div>
          )}

          {loadingData ? (
            <div className="text-center py-8 text-gray-400">
              Loading transactions...
            </div>
          ) : (
            <TransactionTable
              transactions={filteredTransactions}
              selectedTransactions={selectedTransactions}
              pendingWithdrawals={pendingWithdrawals}
              onSelectTransaction={handleSelectTransaction}
              onSelectAll={handleSelectAll}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransactionsPanel;
