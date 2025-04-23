
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  product: {
    title: string;
    price: number;
    dailyIncome: number;
  };
  cycleDays: number;
  totalIncome: number;
  newBalance: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  product,
  cycleDays,
  totalIncome,
  newBalance,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#222222] border-gray-700 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Investment</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Are you sure you want to invest ₹{product.price.toLocaleString()} in {product.title}?
            
            <div className="mt-4 p-3 bg-black/30 rounded-lg">
              <p className="flex justify-between">
                <span>Investment amount:</span>
                <span className="text-investment-gold">₹{product.price.toLocaleString()}</span>
              </p>
              <p className="flex justify-between">
                <span>Daily income:</span>
                <span className="text-investment-gold">₹{product.dailyIncome.toLocaleString()}</span>
              </p>
              <p className="flex justify-between">
                <span>Total income ({cycleDays} days):</span>
                <span className="text-investment-gold">₹{totalIncome.toLocaleString()}</span>
              </p>
              <p className="flex justify-between">
                <span>Balance after investment:</span>
                <span className="text-white">₹{newBalance}</span>
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-white"
          >
            Confirm Investment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
