
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { migrateLocalStorageToSupabase } from "@/utils/migrationUtils";
import { toast } from '@/components/ui/use-toast';
import { Loader2, Cloud, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';

const CloudMigration = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [hasLocalData, setHasLocalData] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    // Check if there's local data to migrate
    const storedUsers = localStorage.getItem('investmentUsers');
    const currentUser = localStorage.getItem('investmentUser');
    setHasLocalData(!!(storedUsers || currentUser));
    
    // Check if migration was already completed
    const migrationStatus = localStorage.getItem('cloudMigrationCompleted');
    if (migrationStatus === 'true') {
      setMigrationComplete(true);
    }
  }, []);
  
  const simulateProgress = () => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 500);
    
    return () => clearInterval(interval);
  };
  
  const handleMigrate = async () => {
    setIsMigrating(true);
    setProgress(0);
    
    // Start progress simulation
    const stopProgress = simulateProgress();
    
    try {
      const result = await migrateLocalStorageToSupabase();
      
      // Ensure progress reaches 100% for visual completion
      setProgress(100);
      
      if (result) {
        toast({
          title: "Migration Successful",
          description: "Your data has been successfully migrated to the cloud.",
          variant: "default"
        });
        setMigrationComplete(true);
        localStorage.setItem('cloudMigrationCompleted', 'true');
      } else {
        toast({
          title: "Migration Not Needed",
          description: "No local data found to migrate or migration was already completed.",
          variant: "default"
        });
        setMigrationComplete(true);
        localStorage.setItem('cloudMigrationCompleted', 'true');
      }
    } catch (error) {
      console.error("Migration failed:", error);
      toast({
        title: "Migration Failed",
        description: "There was an error migrating your data. Please try again.",
        variant: "destructive"
      });
      // Stop progress simulation
      stopProgress();
    } finally {
      setIsMigrating(false);
    }
  };
  
  if ((!hasLocalData && !user) || migrationComplete) {
    return null;
  }
  
  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black border border-gray-700 p-4 rounded-lg shadow-lg z-50 w-11/12 max-w-md">
      <div className="flex items-center mb-2">
        <Cloud className="text-investment-gold mr-2" size={20} />
        <h3 className="text-lg font-medium text-white">Cloud Migration</h3>
      </div>
      
      <p className="text-gray-400 mb-4">
        We've detected your data is stored locally on this device. Migrate it to our secure cloud database for better security and access from any device.
      </p>
      
      {isMigrating && (
        <div className="mb-4">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">Migrating data: {Math.round(progress)}% complete</p>
        </div>
      )}
      
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
          ) : migrationComplete ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Completed
            </>
          ) : (
            "Migrate to Cloud"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CloudMigration;
