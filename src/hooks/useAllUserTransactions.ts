
import { useEffect, useState } from 'react';
import { TransactionRecord, User } from '@/types/auth';

export const useAllUserTransactions = () => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = () => {
    try {
      // Get all users from localStorage
      const storedUsers = localStorage.getItem('investmentUsers');
      const currentUser = localStorage.getItem('investmentUser');
      
      let allUsers: User[] = [];
      
      // Parse stored users if available
      if (storedUsers) {
        allUsers = JSON.parse(storedUsers);
      }
      
      // Add current user if available and not already in the list
      if (currentUser) {
        const parsedUser = JSON.parse(currentUser) as User;
        if (!allUsers.some(u => u.id === parsedUser.id)) {
          allUsers.push(parsedUser);
        }
      }
      
      // Set users state
      setUsers(allUsers);
      
      // Extract all transactions with user information
      const allTransactions: TransactionRecord[] = [];
      
      allUsers.forEach(user => {
        if (user.transactions && user.transactions.length > 0) {
          // Add user information to each transaction
          const userTransactions = user.transactions.map(transaction => ({
            ...transaction,
            userId: user.id,
            userName: user.username
          }));
          allTransactions.push(...userTransactions);
        }
      });
      
      // Sort transactions by timestamp, newest first
      const sortedTransactions = allTransactions.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setTransactions(sortedTransactions);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up a storage event listener for real-time updates
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'investmentUsers' || event.key === 'investmentUser') {
        console.log('Storage changed, refreshing data');
        fetchData();
      }
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Set up a polling interval to check for new data regularly
    const intervalId = setInterval(fetchData, 5000);
    
    // Clean up listeners on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);
  
  return { transactions, users, loading, error, refreshData: fetchData };
};
