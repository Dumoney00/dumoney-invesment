
import React from 'react';
import { User } from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccountSummaryProps {
  user: User | null;
}

const AccountSummary: React.FC<AccountSummaryProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <div className="bg-[#222222] rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="text-investment-gold" />
            <h2 className="text-white font-medium">Available Balance</h2>
          </div>
          <span className="text-investment-gold text-xl font-bold">
            ₹{user?.balance.toFixed(2) || '0.00'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="bg-green-600 hover:bg-green-700 text-white border-0"
            onClick={() => navigate('/deposit')}
          >
            Deposit
          </Button>
          <Button
            variant="outline"
            className="bg-red-600 hover:bg-red-700 text-white border-0"
            onClick={() => navigate('/withdraw')}
          >
            Withdraw
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountSummary;
