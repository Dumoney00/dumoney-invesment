
import React from 'react';
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';
import { TransactionFormValues } from './types';

interface AmountSelectorProps {
  form: UseFormReturn<TransactionFormValues>;
}

const AmountSelector: React.FC<AmountSelectorProps> = ({ form }) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Ensure we have a valid number
    const value = parseFloat(e.target.value);
    form.setValue("amount", isNaN(value) ? 0 : value);
  };

  return (
    <div className="space-y-2">
      <label htmlFor="amount" className="text-gray-300 block">Amount</label>
      <Input
        id="amount"
        type="number"
        value={form.watch("amount")}
        onChange={handleAmountChange}
        className="bg-[#222222] border-gray-700 text-white text-xl py-6"
        placeholder="Enter withdrawal amount"
        min="1"
      />
    </div>
  );
};

export default AmountSelector;
