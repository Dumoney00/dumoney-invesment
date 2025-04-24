
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from 'react-hook-form';
import { TransactionFormValues } from './types';

interface AmountSelectorProps {
  form: UseFormReturn<TransactionFormValues>;
  presetAmounts: number[];
}

const AmountSelector: React.FC<AmountSelectorProps> = ({ form, presetAmounts }) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Ensure we have a valid number
    const value = parseFloat(e.target.value);
    form.setValue("amount", isNaN(value) ? 0 : value);
  };

  return (
    <>
      <div className="space-y-2">
        <label htmlFor="amount" className="text-gray-300 block">Amount</label>
        <Input
          id="amount"
          type="number"
          value={form.watch("amount")}
          onChange={handleAmountChange}
          className="bg-[#222222] border-gray-700 text-white text-xl py-6"
          placeholder="Enter amount"
          min="1"
        />
      </div>
      
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
    </>
  );
};

export default AmountSelector;
