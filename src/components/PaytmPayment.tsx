
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Smartphone } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";

interface PaytmPaymentProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaytmPayment: React.FC<PaytmPaymentProps> = ({ amount, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserDeposit } = useAuth();
  
  const initiatePayment = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would make an API call to your backend
      // to generate a Paytm order token and redirect to Paytm gateway
      
      // For demo purposes, we'll simulate a successful payment after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      toast({
        title: "Payment Initiated",
        description: `Redirecting to Paytm for payment of ₹${amount}`,
      });
      
      // Simulate another delay to mimic gateway processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user wallet directly
      updateUserDeposit(amount);
      
      // Show confirmation toast
      toast({
        title: "Payment Successful",
        description: `₹${amount} has been added to your wallet`,
      });
      
      // Call success callback
      onSuccess();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Could not connect to Paytm gateway",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-[#222222] p-4 rounded-lg space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Smartphone className="h-6 w-6 text-investment-gold" />
        <h3 className="text-lg font-medium">Pay with Paytm</h3>
      </div>
      
      <p className="text-gray-400">Amount: <span className="text-white font-bold">₹{amount}</span></p>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 border-gray-700"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          className="flex-1 bg-[#00BAF2] hover:bg-[#00BAF2]/90 text-black" 
          onClick={initiatePayment}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Pay with Paytm"}
        </Button>
      </div>
    </div>
  );
};

export default PaytmPayment;
