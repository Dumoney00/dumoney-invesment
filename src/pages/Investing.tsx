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

const investmentData = [
  {
    id: 1,
    title: "Oil Refinery Processing Unit",
    image: "/lovable-uploads/39854854-dee8-4bf0-a045-eff7813c1370.png",
    price: 1200.00,
    dailyIncome: 40.00,
    cycleDays: 45,
    viewCount: 6351,
    locked: false,
  },
  {
    id: 2,
    title: "Industrial Gas Processing Plant",
    image: "/lovable-uploads/1541f643-6e7a-4b1f-b83a-533eb61d205f.png",
    price: 2400.00,
    dailyIncome: 80.00,
    cycleDays: 45,
    viewCount: 1730,
    locked: false,
  },
  {
    id: 3,
    title: "Pipeline Network System",
    image: "/lovable-uploads/4b9b18f6-756a-4f3b-aafc-0f0501a3ce42.png",
    price: 4800.00,
    dailyIncome: 160.00,
    cycleDays: 45,
    viewCount: 4677,
    locked: false,
  },
  {
    id: 4,
    title: "Mining Processing Facility",
    image: "/lovable-uploads/5ac44beb-15bc-49ee-8192-f6369f2e9ba1.png",
    price: 10000.00,
    dailyIncome: 500.00,
    cycleDays: 30,
    viewCount: 4329,
    locked: true,
    requiredProductId: 1,
  },
  {
    id: 5,
    title: "Gold Processing Plant",
    image: "/lovable-uploads/d21fc3fe-5410-4485-b5e2-bfeed3f04d3f.png",
    price: 12000.00,
    dailyIncome: 700.00,
    cycleDays: 30,
    viewCount: 2295,
    locked: true,
    requiredProductId: 2,
  },
  {
    id: 6,
    title: "Oil Field Equipment",
    image: "/lovable-uploads/cdc5ad7e-14e7-41a9-80df-35f3af265a34.png",
    price: 15000.00,
    dailyIncome: 900.00,
    cycleDays: 30,
    viewCount: 3187,
    locked: true,
    requiredProductId: 3,
  },
  {
    id: 7,
    title: "Mineral Extraction System",
    image: "/lovable-uploads/c71c2543-3f57-4302-b98f-e5030facc992.png",
    price: 18000.00,
    dailyIncome: 1200.00,
    cycleDays: 30,
    viewCount: 2514,
    locked: true,
    requiredProductId: 4,
  },
  {
    id: 8,
    title: "Heavy Mining Excavator",
    image: "/lovable-uploads/e5629de9-3d0b-4460-b0c5-fdf1020e6864.png",
    price: 22000.00,
    dailyIncome: 1500.00,
    cycleDays: 30,
    viewCount: 1876,
    locked: true,
    requiredProductId: 5,
  }
];

const Investing: React.FC = () => {
  const { user, isAuthenticated, updateUserBalance, sellOwnedProduct } = useAuth();
  const [userInvestments, setUserInvestments] = useState<typeof investmentData>([]);
  const [lastIncomeTime, setLastIncomeTime] = useState<number | null>(null);
  const [sellProductId, setSellProductId] = useState<number | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user && user.ownedProducts) {
      const owned = investmentData.filter(item => user.ownedProducts.includes(item.id));
      setUserInvestments(owned);
    } else {
      setUserInvestments([]);
    }
  }, [user]);

  const totalDailyIncome = userInvestments.reduce((total, item) => total + item.dailyIncome, 0);
  
  const collectDailyIncome = () => {
    const now = Date.now();
    
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
  
  const handleSellProduct = (productId: number) => {
    setSellProductId(productId);
  };
  
  const confirmSellProduct = () => {
    if (sellProductId === null) return;
    
    const productToSell = userInvestments.find(item => item.id === sellProductId);
    if (!productToSell) return;
    
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
  
  const cancelSellProduct = () => {
    setSellProductId(null);
  };
  
  const productBeingSold = userInvestments.find(item => item.id === sellProductId);

  return (
    <div className="min-h-screen bg-black pb-24">
      <header className="bg-[#333333] py-4">
        <h1 className="text-white text-xl text-center font-medium">— Investing —</h1>
      </header>
      
      <div className="bg-investment-yellow h-2"></div>
      
      <div className="p-4">
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
        
        <Button 
          className="w-full bg-investment-gold hover:bg-investment-gold/90 py-6 mb-6"
          onClick={collectDailyIncome}
        >
          Collect Daily Income
        </Button>
        
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
                cycleDays={item.cycleDays}
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
