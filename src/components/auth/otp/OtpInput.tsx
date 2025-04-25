
import React, { memo } from 'react';
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  maxLength?: number;
}

const OtpInput: React.FC<OtpInputProps> = ({ 
  value, 
  onChange, 
  disabled = false,
  maxLength = 6
}) => {
  return (
    <div className="flex justify-center">
      <InputOTP
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        disabled={disabled}
        render={({ slots }) => (
          <InputOTPGroup>
            {slots.map((slot, index) => (
              <InputOTPSlot
                key={index}
                {...slot}
                index={index}
                className="bg-[#333333] border-gray-700 focus:border-investment-gold focus:ring-investment-gold/20"
              />
            ))}
          </InputOTPGroup>
        )}
      />
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export default memo(OtpInput);
