
import React from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface ProductDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: number;
    title: string;
    image: string;
    price: number;
    dailyIncome: number;
  };
  onConfirmInvest: () => void;
}

const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({
  open,
  onOpenChange,
  product,
  onConfirmInvest
}) => {
  const { user } = useAuth();
  
  // Calculate other metrics
  const hourlyIncome = parseFloat((product.dailyIncome / 24).toFixed(2));
  const cycleDays = 41; // Fixed for now as per the image
  const totalIncome = parseFloat((product.dailyIncome * cycleDays).toFixed(2));
  
  // Check if user has enough balance
  const hasEnoughBalance = user && user.balance >= product.price;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#222222] border-0 text-white p-0 max-w-md">
        <DialogClose className="absolute right-4 top-4 z-10 bg-white/10 rounded-full p-1">
          <X className="h-6 w-6 text-white" />
        </DialogClose>
        
        {/* Product Image */}
        <div className="w-full">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-48 object-cover"
          />
        </div>
        
        {/* Product Details */}
        <div className="p-6 pt-4">
          <h2 className="text-2xl font-bold mb-1">{product.title}</h2>
          <p className="text-gray-400 mb-4">
            Select equipment which you prefer! You can share the equipment income bonus every day!
          </p>
          
          <div className="text-investment-gold text-4xl font-bold mb-6">
            ₹{product.price.toLocaleString()}
          </div>
          
          {/* Show current balance */}
          <div className="bg-black/20 p-3 rounded-lg mb-4">
            <div className="flex justify-between">
              <span>Your current balance:</span>
              <span className={user && user.balance < product.price ? "text-red-500 font-bold" : "text-investment-gold font-bold"}>
                ₹{user?.balance.toLocaleString() || '0'}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Purchase quantity limit:</span>
              <span className="text-red-500 font-bold">0/10</span>
            </div>
            
            <div className="flex justify-between">
              <span>Hourly income:</span>
              <span className="font-bold">₹{hourlyIncome}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Daily income:</span>
              <span className="font-bold">₹{product.dailyIncome.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Cycle days:</span>
              <span className="font-bold">{cycleDays} days</span>
            </div>
            
            <div className="flex justify-between">
              <span>Total income:</span>
              <span className="text-investment-gold font-bold">₹{totalIncome.toLocaleString()}</span>
            </div>
          </div>
          
          <Button 
            className={`w-full mt-6 py-6 text-white text-xl font-bold rounded-full ${
              hasEnoughBalance 
                ? "bg-gradient-to-r from-investment-gold to-yellow-500 hover:from-yellow-500 hover:to-investment-gold" 
                : "bg-gray-600 cursor-not-allowed"
            }`}
            onClick={onConfirmInvest}
            disabled={!hasEnoughBalance}
          >
            {hasEnoughBalance ? "Confirm Invest" : "Insufficient Balance"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
