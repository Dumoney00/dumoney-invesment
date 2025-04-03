
import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { TrendingUp, DollarSign } from 'lucide-react';

// This should match the data in Products.tsx
const investmentData = [
  {
    id: 1,
    title: "Catalytic Reforming Reactor #1",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 250.00,
    dailyIncome: 50.00,
    viewCount: 6351,
  },
  {
    id: 2,
    title: "Catalytic Reforming Reactor #2",
    image: "https://images.unsplash.com/photo-1579784265015-1272f5d28154?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 800.00,
    dailyIncome: 60.00,
    viewCount: 1730,
  },
  {
    id: 3,
    title: "Catalytic Reforming Reactor #3",
    image: "https://images.unsplash.com/photo-1525093127870-67be6104d8a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 1400.00,
    dailyIncome: 108.00,
    viewCount: 4677,
  },
  {
    id: 4,
    title: "Catalytic Reforming Reactor #4",
    image: "https://images.unsplash.com/photo-1578256420811-3a73e8286fb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 5000.00,
    dailyIncome: 417.00,
    viewCount: 4329,
  },
  {
    id: 5,
    title: "Catalytic Reforming Reactor #5",
    image: "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 3500.00,
    dailyIncome: 280.00,
    viewCount: 2295,
  },
  {
    id: 6,
    title: "Fractionation Column Alpha",
    image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 1200.00,
    dailyIncome: 96.00,
    viewCount: 3187,
  },
  {
    id: 7,
    title: "Hydrocracking Unit XL",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 2800.00,
    dailyIncome: 224.00,
    viewCount: 2514,
  },
  {
    id: 8,
    title: "Coker Processing System",
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 4200.00,
    dailyIncome: 336.00,
    viewCount: 1876,
  }
];

const Investing: React.FC = () => {
  const { user, isAuthenticated, updateUserBalance } = useAuth();
  const [userInvestments, setUserInvestments] = useState<typeof investmentData>([]);
  const [lastIncomeTime, setLastIncomeTime] = useState<number | null>(null);
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
          description: `$${totalDailyIncome.toFixed(2)} has been added to your account`
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
              <span className="text-white text-2xl font-bold">{totalDailyIncome.toFixed(2)}</span>
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
          <div className="space-y-4">
            {userInvestments.map((item) => (
              <div key={item.id} className="bg-[#222222] rounded-lg overflow-hidden">
                <div className="flex">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-24 h-24 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="text-white font-medium">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <DollarSign className="text-investment-gold" size={16} />
                      <span className="text-investment-gold">{item.dailyIncome.toFixed(2)}/day</span>
                    </div>
                  </div>
                </div>
              </div>
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
      
      <Navigation />
      <FloatingActionButton />
    </div>
  );
};

export default Investing;
