
import React from 'react';

interface WithdrawalTimeInfoProps {
  isDeposit: boolean;
  isWithdrawalTime: boolean;
}

const WithdrawalTimeInfo: React.FC<WithdrawalTimeInfoProps> = ({ isDeposit, isWithdrawalTime }) => {
  if (isDeposit) {
    return null;
  }
  
  return (
    <div className="mb-4 px-3 py-2 bg-[#333333] rounded-lg">
      <p className="text-center text-white text-sm">
        {isWithdrawalTime 
          ? "✅ Withdrawals are currently open" 
          : "⏰ Withdrawals are only available from 11:00 AM to 12:00 PM, Monday to Friday"}
      </p>
    </div>
  );
};

export default WithdrawalTimeInfo;
