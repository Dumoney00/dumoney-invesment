
import React, { useState } from 'react';
import { Eye, ShoppingCart, DollarSign } from 'lucide-react';
import ProductDetailsDialog from './ProductDetailsDialog';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface InvestmentCardProps {
  id: number;
  title: string;
  image: string;
  price: number;
  dailyIncome: number;
  viewCount: number;
  owned?: boolean;
  onInvest?: () => void;
  onSell?: () => void;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  id,
  title,
  image,
  price,
  dailyIncome,
  viewCount,
  owned = false,
  onInvest,
  onSell
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { user, isAuthenticated, addOwnedProduct } = useAuth();
  
  const handleActionClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to manage investments",
        variant: "destructive"
      });
      return;
    }
    
    if (owned) {
      // For selling, show confirmation dialog
      if (onSell) {
        onSell();
      }
      return;
    }
    
    // Show product details dialog
    setShowDetails(true);
  };
  
  const handleConfirmInvest = () => {
    // Check if user has enough balance
    if (user && user.balance >= price) {
      // Debit from wallet and add product to owned products
      addOwnedProduct(id, price);
      
      // Call onInvest callback if provided
      if (onInvest) {
        onInvest();
      }
      
      toast({
        title: "Investment Successful",
        description: `You have successfully invested in ${title}`,
      });
    } else {
      toast({
        title: "Insufficient Balance",
        description: "Please add funds to your wallet to complete this investment",
        variant: "destructive"
      });
    }
  };
  
  return (
    <>
      <div className="investment-card mb-6">
        <div className="relative">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-44 object-cover"
          />
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full flex items-center gap-1">
            <span>{viewCount}</span>
            <Eye size={18} />
          </div>
          {owned && (
            <div className="absolute top-4 left-4 bg-investment-gold/90 text-black px-3 py-1 rounded-full text-xs font-medium">
              Owned
            </div>
          )}
        </div>
        
        <div className="p-2">
          <h3 className="text-white text-sm font-medium truncate">{title}</h3>
          
          <div className="flex justify-between mt-2">
            <div>
              <p className="text-investment-gold text-xl font-bold">₹{price.toLocaleString()}</p>
              <p className="text-gray-400 text-xs">Price</p>
            </div>
            <div>
              <p className="text-investment-gold text-xl font-bold">₹{dailyIncome.toLocaleString()}</p>
              <p className="text-gray-400 text-xs flex items-center gap-1">
                <DollarSign size={12} className="text-investment-gold" />
                Daily income
              </p>
            </div>
          </div>
          
          <button 
            className={`investment-button w-full mt-3 ${owned ? 'bg-red-500 hover:bg-red-600' : ''}`}
            onClick={handleActionClick}
          >
            {owned ? (
              <>
                <DollarSign size={18} />
                <span>Sell</span>
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span>Invest</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {!owned && (
        <ProductDetailsDialog
          open={showDetails}
          onOpenChange={setShowDetails}
          product={{ id, title, image, price, dailyIncome }}
          onConfirmInvest={handleConfirmInvest}
        />
      )}
    </>
  );
};

export default InvestmentCard;
