
import React from 'react';
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';
import { TransactionFormValues } from './types';

interface AccountDetailsInputProps {
  form: UseFormReturn<TransactionFormValues>;
}

const AccountDetailsInput: React.FC<AccountDetailsInputProps> = ({ form }) => {
  if (form.watch("paymentMethod") === "paytm") {
    return null;
  }
  
  return (
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
  );
};

export default AccountDetailsInput;
