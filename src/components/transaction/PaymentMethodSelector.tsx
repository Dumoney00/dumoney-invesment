
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Smartphone, Phone, CreditCard, Building } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { TransactionFormValues } from './types';

interface PaymentMethodSelectorProps {
  form: UseFormReturn<TransactionFormValues>;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ form }) => {
  return (
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
  );
};

export default PaymentMethodSelector;
