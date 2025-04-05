
import React, { useState } from 'react';
import { Eye, ShoppingCart, Timer } from 'lucide-react';
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
  onInvest?: () => void;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  id,
  title,
  image,
  price,
  dailyIncome,
  viewCount,
  onInvest
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { user, isAuthenticated } = useAuth();
  
  const handleInvestClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to invest in products",
        variant: "destructive"
      });
      return;
    }
    
    // Check if user has enough balance before showing dialog
    if (user && user.balance < price) {
      toast({
        title: "Insufficient Balance",
        description: `You need ₹${price.toFixed(2)} to invest in this product. Please add funds.`,
        variant: "destructive"
      });
      return;
    }
    
    setShowDetails(true);
  };
  
  const handleConfirmInvest = () => {
    setShowDetails(false);
    if (onInvest) {
      onInvest();
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
                <Timer size={12} className="text-investment-gold" />
                Daily income
              </p>
            </div>
          </div>
          
          <button 
            className="investment-button w-full mt-3"
            onClick={handleInvestClick}
          >
            <ShoppingCart size={18} />
            <span>Invest</span>
          </button>
        </div>
      </div>
      
      <ProductDetailsDialog
        open={showDetails}
        onOpenChange={setShowDetails}
        product={{ id, title, image, price, dailyIncome }}
        onConfirmInvest={handleConfirmInvest}
      />
    </>
  );
};

export default InvestmentCard;
