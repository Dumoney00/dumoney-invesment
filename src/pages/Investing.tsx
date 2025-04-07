
import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { TrendingUp, DollarSign } from 'lucide-react';
import InvestmentCard from '@/components/InvestmentCard';
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

// This should match the data in Products.tsx
const investmentData = [
  {
    id: 1,
    title: "Mining Excavator Alpha",
    image: "https://images.unsplash.com/photo-1605131545453-2c1838d6dbb7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 250.00,
    dailyIncome: 50.00,
    viewCount: 6351,
  },
  {
    id: 2,
    title: "Industrial Drill XL-5000",
    image: "https://images.unsplash.com/photo-1622022526425-b358809cc649?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 800.00,
    dailyIncome: 60.00,
    viewCount: 1730,
  },
  {
    id: 3,
    title: "Mining Crusher S3000",
    image: "https://images.unsplash.com/photo-1513293960556-9fcd584f3a3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 1400.00,
    dailyIncome: 108.00,
    viewCount: 4677,
  },
  {
    id: 4,
    title: "Gold Mining Processor",
    image: "https://images.unsplash.com/photo-1638913662295-9630035ef770?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 5000.00,
    dailyIncome: 417.00,
    viewCount: 4329,
  },
  {
    id: 5,
    title: "Diamond Mining Equipment",
    image: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 3500.00,
    dailyIncome: 280.00,
    viewCount: 2295,
  },
  {
    id: 6,
    title: "Hydraulic Mining Shovel",
    image: "https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 1200.00,
    dailyIncome: 96.00,
    viewCount: 3187,
  },
  {
    id: 7,
    title: "Silver Mining System",
    image: "https://images.unsplash.com/photo-1624987758446-d15141b540c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 2800.00,
    dailyIncome: 224.00,
    viewCount: 2514,
  },
  {
    id: 8,
    title: "Mining Dump Truck",
    image: "https://images.unsplash.com/photo-1569764099715-026ec5511e65?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 4200.00,
    dailyIncome: 336.00,
    viewCount: 1876,
  }
];

const Investing: React.FC = () => {
  const { user, isAuthenticated, updateUserBalance, sellOwnedProduct } = useAuth();
  const [userInvestments, setUserInvestments] = useState<typeof investmentData>([]);
  const [lastIncomeTime, setLastIncomeTime] = useState<number | null>(null);
  const [sellProductId, setSellProductId] = useState<number | null>(null);
  const navigate = useNavigate();
  
  // Load user's owned products
  useEffect(() => {
    if (user && user.ownedProducts) {
      const owned = investmentData.filter(item => user.ownedProducts.includes(item.id));
      setUserInvestments(owned);
    } else {
      setUserInvestments([]);
    }
  }, [user]);

  // Calculate total daily income
  const totalDailyIncome = userInvestments.reduce((total, item) => total + item.dailyIncome, 0);
  
  // Collect daily income function
  const collectDailyIncome = () => {
    const now = Date.now();
    
    // Check if 24 hours have passed since last collection (or if first time)
    if (!lastIncomeTime || (now - lastIncomeTime) > 24 * 60 * 60 * 1000) {
      if (totalDailyIncome > 0 && isAuthenticated) {
        updateUserBalance(totalDailyIncome);
        setLastIncomeTime(now);
        
        toast({
          title: "Income Collected",
          description: `₹${totalDailyIncome.toFixed(2)} has been added to your account`
        });
      } else if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description: "Please login to collect your income",
          variant: "destructive"
        });
      } else {
        toast({
          title: "No Income Available",
          description: "You don't have any investments generating income",
          variant: "destructive"
        });
      }
    } else {
      // Calculate time remaining until next collection
      const timeRemaining = 24 * 60 * 60 * 1000 - (now - lastIncomeTime);
      const hoursRemaining = Math.floor(timeRemaining / (60 * 60 * 1000));
      const minutesRemaining = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
      
      toast({
        title: "Income Already Collected",
        description: `Next collection available in ${hoursRemaining}h ${minutesRemaining}m`,
        variant: "destructive"
      });
    }
  };
  
  // Handle selling a product
  const handleSellProduct = (productId: number) => {
    setSellProductId(productId);
  };
  
  // Confirm selling a product
  const confirmSellProduct = () => {
    if (sellProductId === null) return;
    
    const productToSell = userInvestments.find(item => item.id === sellProductId);
    if (!productToSell) return;
    
    // Calculate sell price (70% of purchase price as an example)
    const sellPrice = Math.round(productToSell.price * 0.7);
    
    const result = sellOwnedProduct(sellProductId, sellPrice);
    
    if (result) {
      toast({
        title: "Investment Sold",
        description: `You sold ${productToSell.title} for ₹${sellPrice.toFixed(2)}`
      });
    }
    
    setSellProductId(null);
  };
  
  // Cancel selling a product
  const cancelSellProduct = () => {
    setSellProductId(null);
  };
  
  // Find the product being sold (if any)
  const productBeingSold = userInvestments.find(item => item.id === sellProductId);

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="bg-[#333333] py-4">
        <h1 className="text-white text-xl text-center font-medium">— Investing —</h1>
      </header>
      
      {/* Yellow Banner */}
      <div className="bg-investment-yellow h-2"></div>
      
      <div className="p-4">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-investment-gold to-yellow-500 rounded-xl p-4">
            <p className="text-white text-sm mb-1">Daily income</p>
            <div className="flex items-center gap-2">
              <DollarSign className="text-white" size={24} />
              <span className="text-white text-2xl font-bold">₹{totalDailyIncome.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-investment-gold to-yellow-500 rounded-xl p-4">
            <p className="text-white text-sm mb-1">Investment quantity</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="text-white" size={24} />
              <span className="text-white text-2xl font-bold">{userInvestments.length}</span>
            </div>
          </div>
        </div>
        
        {/* Collect Income Button */}
        <Button 
          className="w-full bg-investment-gold hover:bg-investment-gold/90 py-6 mb-6"
          onClick={collectDailyIncome}
        >
          Collect Daily Income
        </Button>
        
        {/* Investment List */}
        <h2 className="text-xl text-white font-medium mb-4">— Product List —</h2>
        
        {userInvestments.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {userInvestments.map((item) => (
              <InvestmentCard
                key={item.id}
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                dailyIncome={item.dailyIncome}
                viewCount={0}
                owned={true}
                onSell={() => handleSellProduct(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <img 
              src="/lovable-uploads/5315140b-b55c-4211-85e0-8b4d86ed8ace.png" 
              alt="No investments" 
              className="w-40 h-40 mb-4"
            />
            <p className="text-gray-400 text-center mb-6">No product data!</p>
            <Button 
              className="bg-gradient-to-r from-investment-gold to-yellow-500 text-white"
              onClick={() => navigate('/products')}
            >
              To make money &gt;&gt;
            </Button>
          </div>
        )}
      </div>
      
      {/* Sell Confirmation Dialog */}
      <AlertDialog open={sellProductId !== null} onOpenChange={(open) => !open && setSellProductId(null)}>
        <AlertDialogContent className="bg-[#222222] border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Sale</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              {productBeingSold && (
                <>
                  Are you sure you want to sell {productBeingSold.title}?
                  <div className="mt-2 p-3 bg-black/30 rounded-lg">
                    <p className="flex justify-between">
                      <span>Original price:</span>
                      <span className="text-investment-gold">₹{productBeingSold.price.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Sell price (70%):</span>
                      <span className="text-investment-gold">₹{(productBeingSold.price * 0.7).toFixed(2)}</span>
                    </p>
                  </div>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmSellProduct}
              className="bg-investment-gold hover:bg-investment-gold/90 text-white"
            >
              Confirm Sale
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Navigation />
      <FloatingActionButton />
    </div>
  );
};

export default Investing;
