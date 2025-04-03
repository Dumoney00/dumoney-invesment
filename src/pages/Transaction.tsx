
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from '@/components/Navigation';
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Wallet, CreditCard } from 'lucide-react';

const Transaction: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUserDeposit, updateUserWithdraw } = useAuth();
  const [amount, setAmount] = useState<number>(100);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isDeposit = location.pathname === '/deposit';
  const pageTitle = isDeposit ? 'Deposit' : 'Withdraw';
  
  const handleTransaction = async () => {
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (isDeposit) {
      updateUserDeposit(amount);
      toast({
        title: "Deposit Successful",
        description: `$${amount.toFixed(2)} has been added to your account`
      });
    } else {
      if (user && user.balance >= amount) {
        updateUserWithdraw(amount);
        toast({
          title: "Withdrawal Successful",
          description: `$${amount.toFixed(2)} has been withdrawn from your account`
        });
      } else {
        toast({
          title: "Withdrawal Failed",
          description: "Insufficient balance",
          variant: "destructive"
        });
      }
    }
    
    setIsProcessing(false);
  };
  
  const presetAmounts = [50, 100, 250, 500, 1000];
  
  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="bg-[#333333] py-4 relative">
        <Button 
          variant="ghost" 
          className="absolute left-2 top-3 text-gray-300 hover:text-white p-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-white text-xl text-center font-medium">— {pageTitle} —</h1>
      </header>
      
      {/* Yellow Banner */}
      <div className="bg-investment-yellow h-2"></div>
      
      <div className="p-6">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="h-20 w-20 rounded-full bg-[#222222] flex items-center justify-center">
            {isDeposit ? (
              <Wallet size={40} className="text-investment-gold" />
            ) : (
              <CreditCard size={40} className="text-investment-gold" />
            )}
          </div>
        </div>
        
        {/* Current Balance */}
        <div className="bg-[#222222] rounded-lg p-4 mb-6">
          <p className="text-gray-400 text-center text-sm">Available Balance</p>
          <p className="text-investment-gold text-center text-3xl font-bold">
            ${user?.balance.toFixed(2) || '0.00'}
          </p>
        </div>
        
        {/* Amount Input */}
        <div className="mb-6">
          <label htmlFor="amount" className="text-gray-300 mb-2 block">Amount</label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="bg-[#222222] border-gray-700 text-white text-xl py-6"
            placeholder="Enter amount"
          />
        </div>
        
        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          {presetAmounts.map((preset) => (
            <Button
              key={preset}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-[#333333]"
              onClick={() => setAmount(preset)}
            >
              ${preset}
            </Button>
          ))}
        </div>
        
        {/* Submit Button */}
        <Button
          className="w-full bg-investment-gold hover:bg-investment-gold/90 py-6 text-lg"
          onClick={handleTransaction}
          disabled={isProcessing}
        >
          {isProcessing 
            ? "Processing..." 
            : isDeposit 
              ? "Deposit Funds" 
              : "Withdraw Funds"
          }
        </Button>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Transaction;
