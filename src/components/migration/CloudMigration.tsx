
import { useEffect } from 'react';
import { migrateLocalStorageToSupabase } from "@/utils/migrationUtils";
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const CloudMigration = () => {
  const { user } = useAuth();

  useEffect(() => {
    const handleSilentMigration = async () => {
      try {
        // Check if migration was already completed
        const migrationStatus = localStorage.getItem('cloudMigrationCompleted');
        if (migrationStatus === 'true') {
          return;
        }
        
        // Check if there's local data to migrate
        const storedUsers = localStorage.getItem('investmentUsers');
        const currentUser = localStorage.getItem('investmentUser');
        
        if (!storedUsers && !currentUser) {
          // No data to migrate, mark as completed
          localStorage.setItem('cloudMigrationCompleted', 'true');
          return;
        }
        
        // Proceed with migration
        await migrateLocalStorageToSupabase();
        localStorage.setItem('cloudMigrationCompleted', 'true');
        console.log('Silent migration completed successfully');
      } catch (error) {
        console.error("Silent migration failed:", error);
        // Don't show error to user since this is silent migration
      }
    };
    
    // Run migration automatically when component mounts and user is authenticated
    if (user) {
      handleSilentMigration();
    }
  }, [user]); // Re-run when user changes
  
  // No UI is rendered
  return null;
};

export default CloudMigration;
