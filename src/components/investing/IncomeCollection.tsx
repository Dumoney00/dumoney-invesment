
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface IncomeCollectionProps {
  isAuthenticated: boolean;
  totalDailyIncome: number;
  lastIncomeTime: number | null;
  onCollect: () => void;
}

const IncomeCollection: React.FC<IncomeCollectionProps> = ({
  isAuthenticated,
  totalDailyIncome,
  lastIncomeTime,
  onCollect
}) => {
  // Automatically collect income when component mounts if conditions are met
  useEffect(() => {
    const now = Date.now();
    
    if (isAuthenticated && totalDailyIncome > 0 && 
        (!lastIncomeTime || (now - lastIncomeTime) > 24 * 60 * 60 * 1000)) {
      console.log("Auto-collecting daily income");
      onCollect();
      toast({
        title: "Daily Income Collected",
        description: `₹${totalDailyIncome.toFixed(2)} has been added to your withdrawal wallet`,
        variant: "default"
      });
    }
  }, [isAuthenticated, totalDailyIncome, lastIncomeTime, onCollect]);
  
  const handleManualCollect = () => {
    const now = Date.now();
    
    if (!lastIncomeTime || (now - lastIncomeTime) > 24 * 60 * 60 * 1000) {
      if (totalDailyIncome > 0 && isAuthenticated) {
        onCollect();
      } else if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description: "Please login to collect your income",
          variant: "destructive"
        });
      } else {
        toast({
          title: "No Income Available",
          description: "You don't have any investments generating income",
          variant: "destructive"
        });
      }
    } else {
      const timeRemaining = 24 * 60 * 60 * 1000 - (now - lastIncomeTime);
      const hoursRemaining = Math.floor(timeRemaining / (60 * 60 * 1000));
      const minutesRemaining = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
      
      toast({
        title: "Income Already Collected",
        description: `Next collection available in ${hoursRemaining}h ${minutesRemaining}m`,
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      className="w-full bg-investment-gold hover:bg-investment-gold/90 py-6 mb-6"
      onClick={handleManualCollect}
    >
      Collect Daily Income
    </Button>
  );
};

export default IncomeCollection;
