
import { useEffect, useState } from 'react';
import { TransactionRecord, User } from '@/types/auth';

// Similar to the function in AdminTransactionsPanel but as a reusable hook
export const useAllUserTransactions = () => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // In a real app with a backend, this would be an API call
        // For our mock system, we'll get data from localStorage
        
        // Check for all users in storage (in a real app this would come from a database)
        const storedUsers = localStorage.getItem('investmentUsers');
        let allUsers: User[] = [];
        
        if (storedUsers) {
          allUsers = JSON.parse(storedUsers) as User[];
        }
        
        // Also include the current logged-in user
        const currentUser = localStorage.getItem('investmentUser');
        if (currentUser) {
          const parsedUser = JSON.parse(currentUser) as User;
          
          // Only add if not already in the list
          if (!allUsers.some(u => u.id === parsedUser.id)) {
            allUsers.push(parsedUser);
          }
        }
        
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
        
        // Sort by timestamp, newest first
        const sortedTransactions = allTransactions.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setTransactions(sortedTransactions);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  return { transactions, loading, error };
};
