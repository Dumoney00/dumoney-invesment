import React from 'react';
import { User } from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";

interface AccountSummaryProps {
  user: User | null;
}

const AccountSummary: React.FC<AccountSummaryProps> = () => {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {/* Empty component - balance features removed */}
    </div>
  );
};

export default AccountSummary;
