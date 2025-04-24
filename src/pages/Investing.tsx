
import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useAuth } from "@/contexts/AuthContext";
import DailyIncomeHeader from '@/components/investing/DailyIncomeHeader';
import IncomeCollection from '@/components/investing/IncomeCollection';
import EmptyInvestments from '@/components/investing/EmptyInvestments';
import InvestmentGrid from '@/components/investing/InvestmentGrid';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { investmentData } from '@/data/investments';

const Investing: React.FC = () => {
  const { user, isAuthenticated, updateUserBalance, sellOwnedProduct } = useAuth();
  const [userInvestments, setUserInvestments] = useState(investmentData.filter(item => user?.ownedProducts.includes(item.id) || []));
  const [lastIncomeTime, setLastIncomeTime] = useState<number | null>(null);
  const [sellProductId, setSellProductId] = useState<number | null>(null);
  
  useEffect(() => {
    if (user && user.ownedProducts) {
      const owned = investmentData.filter(item => user.ownedProducts.includes(item.id));
      setUserInvestments(owned);
    } else {
      setUserInvestments([]);
    }
  }, [user]);

  const totalDailyIncome = userInvestments.reduce((total, item) => total + item.dailyIncome, 0);
  
  const handleCollectIncome = () => {
    if (totalDailyIncome > 0 && isAuthenticated) {
      updateUserBalance(totalDailyIncome);
      setLastIncomeTime(Date.now());
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
    sellOwnedProduct(sellProductId, sellPrice);
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
        <DailyIncomeHeader 
          totalDailyIncome={totalDailyIncome}
          investmentQuantity={userInvestments.length}
        />
        
        <IncomeCollection
          isAuthenticated={isAuthenticated}
          totalDailyIncome={totalDailyIncome}
          lastIncomeTime={lastIncomeTime}
          onCollect={handleCollectIncome}
        />
        
        <h2 className="text-xl text-white font-medium mb-4">— Product List —</h2>
        
        {userInvestments.length > 0 ? (
          <InvestmentGrid 
            investments={userInvestments}
            onSellProduct={handleSellProduct}
          />
        ) : (
          <EmptyInvestments />
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
