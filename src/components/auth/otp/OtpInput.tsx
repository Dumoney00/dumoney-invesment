
import React from 'react';
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="flex justify-center">
      <InputOTP
        maxLength={6}
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
                className="bg-[#333333] border-gray-700"
              />
            ))}
          </InputOTPGroup>
        )}
      />
    </div>
  );
};

export default OtpInput;
