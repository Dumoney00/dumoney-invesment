
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { migrateLocalStorageToSupabase } from "@/utils/migrationUtils";
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const MigrationInitiator = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [hasLocalData, setHasLocalData] = useState(false);

  useEffect(() => {
    // Check if there's local data to migrate
    const storedUsers = localStorage.getItem('investmentUsers');
    const currentUser = localStorage.getItem('investmentUser');
    setHasLocalData(!!(storedUsers || currentUser));
  }, []);
  
  const handleMigrate = async () => {
    setIsMigrating(true);
    
    try {
      const result = await migrateLocalStorageToSupabase();
      
      if (result) {
        toast({
          title: "Migration Successful",
          description: "Your data has been successfully migrated to the cloud.",
          variant: "default"
        });
        setMigrationComplete(true);
      } else {
        toast({
          title: "Migration Not Needed",
          description: "No local data found to migrate or migration was already completed.",
          variant: "default"
        });
        setMigrationComplete(true);
      }
    } catch (error) {
      console.error("Migration failed:", error);
      toast({
        title: "Migration Failed",
        description: "There was an error migrating your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsMigrating(false);
    }
  };
  
  if (!hasLocalData || migrationComplete) {
    return null;
  }
  
  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black border border-gray-700 p-4 rounded-lg shadow-lg z-50 w-11/12 max-w-md">
      <h3 className="text-lg font-medium text-white mb-2">Local Data Detected</h3>
      <p className="text-gray-400 mb-4">
        We've detected user data stored on your device. Would you like to migrate it to our cloud database for better security and cross-device access?
      </p>
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline"
          className="border-gray-700"
          onClick={() => setMigrationComplete(true)}
          disabled={isMigrating}
        >
          Later
        </Button>
        <Button 
          variant="default" 
          className="bg-investment-gold hover:bg-investment-gold/90"
          onClick={handleMigrate}
          disabled={isMigrating}
        >
          {isMigrating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migrating...
            </>
          ) : (
            "Migrate Data Now"
          )}
        </Button>
      </div>
    </div>
  );
};

export default MigrationInitiator;
