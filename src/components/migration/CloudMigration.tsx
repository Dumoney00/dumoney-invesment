
import { useEffect } from 'react';
import { migrateLocalStorageToSupabase } from "@/utils/migrationUtils";
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const CloudMigration = () => {
  const { user } = useAuth();

  useEffect(() => {
    const handleSilentMigration = async () => {
      // Check if migration was already completed
      const migrationStatus = localStorage.getItem('cloudMigrationCompleted');
      if (migrationStatus === 'true') {
        return;
      }
      
      // Check if there's local data to migrate
      const storedUsers = localStorage.getItem('investmentUsers');
      const currentUser = localStorage.getItem('investmentUser');
      
      if (!storedUsers && !currentUser) {
        return;
      }
      
      try {
        await migrateLocalStorageToSupabase();
        localStorage.setItem('cloudMigrationCompleted', 'true');
        console.log('Silent migration completed successfully');
      } catch (error) {
        console.error("Silent migration failed:", error);
      }
    };
    
    // Run migration automatically when component mounts
    handleSilentMigration();
  }, [user]); // Re-run when user changes
  
  // No UI is rendered
  return null;
};

export default CloudMigration;
