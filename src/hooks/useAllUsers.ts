
import { useState, useEffect } from 'react';
import { User } from '@/types/auth';

export const useAllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = () => {
    try {
      // Get all users from localStorage
      const storedUsers = localStorage.getItem('investmentUsers');
      let allUsers: User[] = [];
      
      // Parse stored users if available
      if (storedUsers) {
        allUsers = JSON.parse(storedUsers);
      }
      
      // Sort users by registration date (newest first)
      // Using ID as a proxy since it's created at registration time
      const sortedUsers = allUsers.sort((a, b) => 
        b.id.localeCompare(a.id)
      );
      
      setUsers(sortedUsers);
      setLoading(false);
      
      // Debug log to verify data
      console.log('Fetched users:', sortedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch users'));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    
    // Set up a storage event listener for real-time updates
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'investmentUsers') {
        console.log('Users storage changed, refreshing list');
        fetchUsers();
      }
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Set up a refresh interval to check for new users every 2 seconds
    const intervalId = setInterval(fetchUsers, 2000);
    
    // Clean up listeners on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);
  
  // Return both the state values and the setter functions
  return { 
    users, 
    setUsers,
    loading, 
    setLoading, 
    error,
    fetchUsers
  };
};
