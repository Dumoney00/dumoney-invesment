
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import ProductHeader from './product-details/ProductHeader';
import ProductInfo from './product-details/ProductInfo';
import WalletInfo from './product-details/WalletInfo';
import ProductMetrics from './product-details/ProductMetrics';
import ConfirmationDialog from './product-details/ConfirmationDialog';

interface ProductDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: number;
    title: string;
    image: string;
    price: number;
    dailyIncome: number;
    cycleDays?: number;
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
  
  const hourlyIncome = parseFloat((product.dailyIncome / 24).toFixed(2));
  const cycleDays = product.cycleDays || 45;
  const totalIncome = parseFloat((product.dailyIncome * cycleDays).toFixed(2));
  const hasEnoughBalance = user && user.balance >= product.price;
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
          <DialogTitle className="sr-only">Product Details</DialogTitle>
          <DialogDescription className="sr-only">View details about this investment product</DialogDescription>
          
          <ProductHeader image={product.image} title={product.title} />
          
          <div className="p-6">
            <ProductInfo title={product.title} price={product.price} />
            
            {user && (
              <WalletInfo 
                balance={user.balance} 
                hasEnoughBalance={hasEnoughBalance} 
              />
            )}
            
            <ProductMetrics 
              hourlyIncome={hourlyIncome}
              dailyIncome={product.dailyIncome}
              cycleDays={cycleDays}
              totalIncome={totalIncome}
            />
            
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
      
      <ConfirmationDialog 
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={handleConfirmation}
        product={product}
        cycleDays={cycleDays}
        totalIncome={totalIncome}
        newBalance={newBalance}
      />
    </>
  );
};

export default ProductDetailsDialog;
