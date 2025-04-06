
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const EmptyTransactionState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <TableRow>
      <TableCell colSpan={4} className="text-center py-10">
        <div className="flex flex-col items-center">
          <p className="text-gray-400 mb-4">No transactions found</p>
          <p className="text-gray-500 mb-4 text-sm">Make a deposit to start using your wallet</p>
          <Button 
            className="bg-investment-gold hover:bg-investment-gold/90"
            onClick={() => navigate('/deposit')}
          >
            Make a Deposit
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmptyTransactionState;
