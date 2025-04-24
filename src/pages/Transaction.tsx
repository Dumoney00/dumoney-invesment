
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import Navigation from '@/components/Navigation';
import { Form } from "@/components/ui/form";
import TransactionHeader from '@/components/transaction/TransactionHeader';
import AmountSelector from '@/components/transaction/AmountSelector';
import WithdrawalTimeInfo from '@/components/transaction/WithdrawalTimeInfo';
import CurrentBalanceDisplay from '@/components/transaction/CurrentBalanceDisplay';
import MarqueeInfo from '@/components/transaction/MarqueeInfo';
import TransactionButton from '@/components/transaction/TransactionButton';
import TransactionIcon from '@/components/transaction/TransactionIcon';
import { TransactionFormValues } from '@/components/transaction/types';

const Transaction: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUserDeposit, updateUserWithdraw } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isDeposit = location.pathname === '/deposit';
  const pageTitle = isDeposit ? 'Deposit' : 'Withdraw';
  
  // Get current time to check withdrawal timing
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentDay = now.getDay(); // 0 is Sunday, 6 is Saturday
  
  // Check if withdrawal is allowed (11:00 AM to 11:30 AM, Monday to Friday)
  const isWithdrawalTime = 
    currentHour === 11 && 
    currentMinute >= 0 && 
    currentMinute <= 30 && 
    currentDay >= 1 && 
    currentDay <= 5;
  
  const form = useForm<TransactionFormValues>({
    defaultValues: {
      amount: 100
    },
  });
  
  const handleTransaction = async (values: TransactionFormValues) => {
    if (!values.amount || values.amount <= 0) {
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
      // Update user wallet
      updateUserDeposit(values.amount);
      toast({
        title: "Deposit Successful",
        description: `₹${values.amount.toFixed(2)} has been added to your account`
      });
      
      // After successful deposit, navigate to the home page to show balance
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      if (user && user.balance >= values.amount) {
        updateUserWithdraw(values.amount);
        toast({
          title: "Withdrawal Successful",
          description: `₹${values.amount.toFixed(2)} has been withdrawn from your account`
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
      <TransactionHeader title={pageTitle} />
      
      <MarqueeInfo />
      
      <div className="p-6">
        <TransactionIcon isDeposit={isDeposit} />
        
        <CurrentBalanceDisplay user={user} />
        
        <WithdrawalTimeInfo isDeposit={isDeposit} isWithdrawalTime={isWithdrawalTime} />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleTransaction)} className="space-y-6">
            <AmountSelector form={form} presetAmounts={presetAmounts} />
            
            <TransactionButton 
              isProcessing={isProcessing} 
              isDeposit={isDeposit} 
              isWithdrawalTime={isWithdrawalTime}
            />
          </form>
        </Form>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Transaction;
