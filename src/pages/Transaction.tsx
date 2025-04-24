
import React, { useState, useEffect } from 'react';
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
  const [currentBalance, setCurrentBalance] = useState(user?.balance || 0);
  const [withdrawalBalance, setWithdrawalBalance] = useState(user?.withdrawalBalance || 0);
  
  const isDeposit = location.pathname === '/deposit';
  
  // Update balances whenever user changes
  useEffect(() => {
    if (user) {
      setCurrentBalance(user.balance);
      setWithdrawalBalance(user.withdrawalBalance);
    }
  }, [user]);
  
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
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isDeposit) {
        updateUserDeposit(values.amount);
        setCurrentBalance(prev => prev + values.amount);
        
        toast({
          title: "Deposit Successful",
          description: `₹${values.amount.toFixed(2)} has been added to your deposit wallet`
        });
      } else {
        // Check withdrawal wallet balance
        if (user && user.withdrawalBalance >= values.amount) {
          updateUserWithdraw(values.amount);
          setWithdrawalBalance(prev => prev - values.amount);
          
          toast({
            title: "Withdrawal Successful",
            description: `₹${values.amount.toFixed(2)} has been withdrawn from your earnings wallet`
          });
        } else {
          toast({
            title: "Withdrawal Failed",
            description: "Insufficient balance in withdrawal wallet. You can only withdraw from your earnings.",
            variant: "destructive"
          });
          setIsProcessing(false);
          return;
        }
      }
      
      // Navigate back after successful transaction
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error("Transaction error:", error);
      toast({
        title: "Transaction Failed",
        description: "An error occurred during the transaction",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      <TransactionHeader title={isDeposit ? 'Deposit' : 'Withdraw'} />
      
      <MarqueeInfo />
      
      <div className="p-6">
        <TransactionIcon isDeposit={isDeposit} />
        
        <div className="space-y-4">
          <CurrentBalanceDisplay 
            user={user} 
            balance={isDeposit ? currentBalance : withdrawalBalance}
            isWithdrawalWallet={!isDeposit}
          />
          
          {!isDeposit && (
            <div className="bg-[#222222] rounded-lg p-4 mb-4">
              <p className="text-yellow-500 text-sm">
                Note: You can only withdraw from your earnings wallet. Deposit wallet funds cannot be withdrawn.
              </p>
            </div>
          )}
          
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
      </div>
      
      <Navigation />
    </div>
  );
};

export default Transaction;
