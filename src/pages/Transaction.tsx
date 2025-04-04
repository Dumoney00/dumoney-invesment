
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from '@/components/Navigation';
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Wallet, CreditCard, Building, Smartphone, Phone } from 'lucide-react';
import { useForm } from "react-hook-form";
import PaytmPayment from '@/components/PaytmPayment';

interface TransactionFormValues {
  amount: number;
  paymentMethod: "upi" | "card" | "bank" | "paytm";
  accountDetails: string;
}

const Transaction: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUserDeposit, updateUserWithdraw } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaytmPayment, setShowPaytmPayment] = useState(false);
  
  const isDeposit = location.pathname === '/deposit';
  const pageTitle = isDeposit ? 'Deposit' : 'Withdraw';
  
  // Get current time to display withdrawal timing
  const now = new Date();
  const currentHour = now.getHours();
  const withdrawalOpen = currentHour === 11; // Only open at 11 AM
  
  const form = useForm<TransactionFormValues>({
    defaultValues: {
      amount: 100,
      paymentMethod: "upi",
      accountDetails: "",
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
    
    if (values.paymentMethod !== 'paytm' && !values.accountDetails) {
      toast({
        title: "Missing Details",
        description: "Please enter account details",
        variant: "destructive"
      });
      return;
    }
    
    // For withdrawals, check if within allowed time
    if (!isDeposit && !withdrawalOpen) {
      toast({
        title: "Withdrawal Unavailable",
        description: "Withdrawals are only available at 11 AM",
        variant: "destructive"
      });
      return;
    }
    
    // For Paytm payment method, show the Paytm payment component
    if (isDeposit && values.paymentMethod === 'paytm') {
      setShowPaytmPayment(true);
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (isDeposit) {
      updateUserDeposit(values.amount);
      toast({
        title: "Deposit Successful",
        description: `₹${values.amount.toFixed(2)} has been added to your account via ${values.paymentMethod.toUpperCase()}`
      });
    } else {
      if (user && user.balance >= values.amount) {
        updateUserWithdraw(values.amount);
        toast({
          title: "Withdrawal Successful",
          description: `₹${values.amount.toFixed(2)} has been withdrawn to your ${values.paymentMethod.toUpperCase()} account`
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
  
  const handlePaytmSuccess = () => {
    if (form.getValues().amount) {
      updateUserDeposit(form.getValues().amount);
      toast({
        title: "Deposit Successful via Paytm",
        description: `₹${form.getValues().amount.toFixed(2)} has been added to your account`
      });
    }
    setShowPaytmPayment(false);
  };
  
  const presetAmounts = [50, 100, 250, 500, 1000];
  
  if (showPaytmPayment) {
    return (
      <div className="min-h-screen bg-black pb-24">
        <header className="bg-[#333333] py-4 relative">
          <Button 
            variant="ghost" 
            className="absolute left-2 top-3 text-gray-300 hover:text-white p-1"
            onClick={() => setShowPaytmPayment(false)}
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-white text-xl text-center font-medium">— Paytm Payment —</h1>
        </header>
        
        <div className="bg-investment-yellow h-2"></div>
        
        <div className="p-6">
          <PaytmPayment 
            amount={form.getValues().amount} 
            onSuccess={handlePaytmSuccess}
            onCancel={() => setShowPaytmPayment(false)}
          />
        </div>
        
        <Navigation />
      </div>
    );
  }
  
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

      {/* Marquee for dynamic info */}
      <div className="overflow-hidden bg-[#222222] py-2 mb-4">
        <div className="whitespace-nowrap animate-marquee">
          <span className="text-investment-gold mx-2">
            Daily withdrawal time: 11:00 AM • Market update: Oil prices up 2.3% • New mining equipment available! •
            USD/INR: 73.45 • BTC: ₹4,721,865 • ETH: ₹262,970 • Daily returns averaging 8.2% •
          </span>
        </div>
      </div>
      
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
            ₹{user?.balance.toFixed(2) || '0.00'}
          </p>
        </div>
        
        {!isDeposit && (
          <div className="mb-4 px-3 py-2 bg-[#333333] rounded-lg">
            <p className="text-center text-white text-sm">
              {withdrawalOpen 
                ? "✅ Withdrawals are currently open" 
                : "⏰ Withdrawals are only available at 11:00 AM"}
            </p>
          </div>
        )}
        
        {/* Transaction Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleTransaction)} className="space-y-6">
            {/* Amount Field */}
            <div className="space-y-2">
              <label htmlFor="amount" className="text-gray-300 block">Amount</label>
              <Input
                id="amount"
                type="number"
                value={form.watch("amount")}
                onChange={(e) => form.setValue("amount", Number(e.target.value))}
                className="bg-[#222222] border-gray-700 text-white text-xl py-6"
                placeholder="Enter amount"
              />
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-[#333333]"
                  onClick={() => form.setValue("amount", preset)}
                >
                  ₹{preset}
                </Button>
              ))}
            </div>
            
            {/* Payment Method Options */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-gray-300">Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-3"
                    >
                      <div className="flex items-center space-x-2 bg-[#222222] p-3 rounded-lg border border-gray-700">
                        <RadioGroupItem value="upi" id="upi" className="text-investment-gold" />
                        <FormLabel htmlFor="upi" className="flex items-center cursor-pointer">
                          <Smartphone className="mr-2 h-5 w-5 text-investment-gold" />
                          <span>UPI</span>
                        </FormLabel>
                      </div>
                      
                      <div className="flex items-center space-x-2 bg-[#222222] p-3 rounded-lg border border-gray-700">
                        <RadioGroupItem value="paytm" id="paytm" className="text-investment-gold" />
                        <FormLabel htmlFor="paytm" className="flex items-center cursor-pointer">
                          <Phone className="mr-2 h-5 w-5 text-[#00BAF2]" />
                          <span>Paytm</span>
                        </FormLabel>
                      </div>
                      
                      <div className="flex items-center space-x-2 bg-[#222222] p-3 rounded-lg border border-gray-700">
                        <RadioGroupItem value="card" id="card" className="text-investment-gold" />
                        <FormLabel htmlFor="card" className="flex items-center cursor-pointer">
                          <CreditCard className="mr-2 h-5 w-5 text-investment-gold" />
                          <span>Card</span>
                        </FormLabel>
                      </div>
                      
                      <div className="flex items-center space-x-2 bg-[#222222] p-3 rounded-lg border border-gray-700">
                        <RadioGroupItem value="bank" id="bank" className="text-investment-gold" />
                        <FormLabel htmlFor="bank" className="flex items-center cursor-pointer">
                          <Building className="mr-2 h-5 w-5 text-investment-gold" />
                          <span>Bank</span>
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            
            {/* Account Details Field - Hide for Paytm */}
            {form.watch("paymentMethod") !== "paytm" && (
              <div className="space-y-2">
                <label className="text-gray-300 block">
                  {form.watch("paymentMethod") === "upi" && "UPI ID"}
                  {form.watch("paymentMethod") === "card" && "Card Number"}
                  {form.watch("paymentMethod") === "bank" && "Account Number"}
                </label>
                <Input
                  value={form.watch("accountDetails")}
                  onChange={(e) => form.setValue("accountDetails", e.target.value)}
                  className="bg-[#222222] border-gray-700 text-white"
                  placeholder={
                    form.watch("paymentMethod") === "upi" ? "Enter UPI ID" :
                    form.watch("paymentMethod") === "card" ? "Enter Card Number" :
                    "Enter Account Number"
                  }
                />
              </div>
            )}
            
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-investment-gold hover:bg-investment-gold/90 py-6 text-lg"
              disabled={isProcessing || (!isDeposit && !withdrawalOpen)}
            >
              {isProcessing 
                ? "Processing..." 
                : isDeposit 
                  ? form.watch("paymentMethod") === "paytm"
                    ? "Continue to Paytm"
                    : "Deposit Funds" 
                  : "Withdraw Funds"
              }
            </Button>
          </form>
        </Form>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Transaction;
