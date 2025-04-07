
import React from 'react';
import { X, Wallet } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
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
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  
  // Calculate other metrics
  const hourlyIncome = parseFloat((product.dailyIncome / 24).toFixed(2));
  const cycleDays = 41; // Fixed as per the reference image
  const totalIncome = parseFloat((product.dailyIncome * cycleDays).toFixed(2));
  
  // Check if user has enough balance
  const hasEnoughBalance = user && user.balance >= product.price;
  
  // Calculate new balance after purchase
  const newBalance = user ? (user.balance - product.price).toFixed(2) : '0.00';
  
  const handleInvestClick = () => {
    if (!hasEnoughBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You need ₹${product.price.toLocaleString()} to invest. Please add funds to your wallet.`,
        variant: "destructive"
      });
      return;
    }
    
    setShowConfirmation(true);
  };
  
  const handleConfirmation = () => {
    setShowConfirmation(false);
    onOpenChange(false);
    onConfirmInvest();
    
    toast({
      title: "Investment Successful",
      description: `You have invested in ${product.title}`,
    });
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#222222] border-0 text-white p-0 max-w-md">
          <DialogClose className="absolute right-2 top-2 z-10 rounded-full bg-black/30 p-1">
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
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-1">{product.title}</h2>
            <p className="text-gray-400 mb-4">
              Select equipment which you prefer! You can share the equipment income bonus every day!
            </p>
            
            <div className="text-investment-gold text-4xl font-bold mb-6">
              ₹{product.price.toLocaleString()}
            </div>
            
            {/* Your wallet info */}
            {user && (
              <div className="bg-black/20 p-3 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Wallet size={16} />
                    Your current balance:
                  </span>
                  <span className={hasEnoughBalance ? "text-investment-gold font-bold" : "text-red-500 font-bold"}>
                    ₹{user.balance.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Purchase quantity limit:</span>
                <span className="text-red-500 font-bold">0/10</span>
              </div>
              
              <div className="flex justify-between">
                <span>Hourly income:</span>
                <span className="font-bold text-white">₹{hourlyIncome}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Daily income:</span>
                <span className="font-bold text-white">₹{product.dailyIncome.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Cycle days:</span>
                <span className="font-bold text-white">{cycleDays} days</span>
              </div>
              
              <div className="flex justify-between">
                <span>Total income:</span>
                <span className="text-investment-gold font-bold">₹{totalIncome.toLocaleString()}</span>
              </div>
            </div>
            
            <Button 
              className={`w-full mt-6 py-6 text-white text-xl font-bold rounded-full ${
                hasEnoughBalance 
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-orange-500 hover:to-yellow-500" 
                  : "bg-gray-600 cursor-not-allowed"
              }`}
              onClick={handleInvestClick}
              disabled={!hasEnoughBalance}
            >
              {hasEnoughBalance ? "Confirm Invest" : "Insufficient Balance"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
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
                  <span>Balance after investment:</span>
                  <span className="text-white">₹{newBalance}</span>
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmation}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-white"
            >
              Confirm Investment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductDetailsDialog;
