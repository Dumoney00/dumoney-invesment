import React, { useState, useEffect } from 'react';
import { Eye, ShoppingCart, DollarSign, Lock } from 'lucide-react';
import ProductDetailsDialog from './ProductDetailsDialog';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface InvestmentCardProps {
  id: number;
  title: string;
  image: string;
  price: number;
  dailyIncome: number;
  cycleDays?: number;
  viewCount: number;
  owned?: boolean;
  locked?: boolean;
  onInvest?: () => void;
  onSell?: () => void;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  id,
  title,
  image,
  price,
  dailyIncome,
  cycleDays = 45,
  viewCount,
  owned = false,
  locked = false,
  onInvest,
  onSell
}) => {
  const [currentViewCount, setCurrentViewCount] = useState(viewCount);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentViewCount(prev => {
        const minCount = 1000;
        const maxCount = 1000000; // 10 lakhs
        const randomChange = Math.floor(Math.random() * 1000) - 500; // Random value between -500 and 500
        const newCount = prev + randomChange;
        
        // Keep the count within bounds
        if (newCount < minCount) return minCount;
        if (newCount > maxCount) return maxCount;
        return newCount;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
    
    if (locked) {
      toast({
        title: "Product Locked",
        description: "Complete the required investment first to unlock this product",
        variant: "destructive"
      });
      return;
    }
    
    if (owned) {
      if (onSell) {
        onSell();
      }
      return;
    }
    
    setShowDetails(true);
  };
  
  const handleConfirmInvest = () => {
    if (user && user.balance >= price) {
      addOwnedProduct(id, price);
      
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
            className={`w-full h-44 object-cover ${locked ? 'opacity-50' : ''}`}
          />
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
            <span>{currentViewCount.toLocaleString()}</span>
            <Eye size={18} />
          </div>
          {owned && (
            <div className="absolute top-4 left-4 bg-investment-gold/90 text-black px-3 py-1 rounded-full text-xs font-medium">
              Owned
            </div>
          )}
          {locked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Lock size={36} className="text-white mb-2" />
              <div className="bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                Complete previous products
              </div>
            </div>
          )}
        </div>
        
        <div className="p-2">
          <h3 className="text-white text-sm font-medium truncate">{title}</h3>
          
          <div className="flex justify-between mt-4 space-x-4">
            <div className="text-center">
              <p className="text-investment-gold text-xl font-bold">₹{price.toLocaleString()}</p>
              <p className="text-gray-400 text-xs">Price</p>
            </div>
            <div className="text-center">
              <p className="text-investment-gold text-xl font-bold">₹{dailyIncome.toLocaleString()}</p>
              <p className="text-gray-400 text-xs flex items-center justify-center gap-1">
                <DollarSign size={12} className="text-investment-gold" />
                Daily income
              </p>
            </div>
          </div>
          
          <button 
            className={`investment-button w-full mt-3 ${owned ? 'bg-red-500 hover:bg-red-600' : ''} ${locked ? 'bg-gray-600 cursor-not-allowed' : ''}`}
            onClick={handleActionClick}
            disabled={locked}
          >
            {owned ? (
              <>
                <DollarSign size={18} />
                <span>Sell</span>
              </>
            ) : locked ? (
              <>
                <Lock size={18} />
                <span>Locked</span>
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
      
      {!owned && !locked && (
        <ProductDetailsDialog
          open={showDetails}
          onOpenChange={setShowDetails}
          product={{ id, title, image, price, dailyIncome, cycleDays }}
          onConfirmInvest={handleConfirmInvest}
        />
      )}
    </>
  );
};

export default InvestmentCard;
