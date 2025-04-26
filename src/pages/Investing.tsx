
import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { useAuth } from "@/contexts/AuthContext";
import DailyIncomeHeader from '@/components/investing/DailyIncomeHeader';
import EmptyInvestments from '@/components/investing/EmptyInvestments';
import InvestmentGrid from '@/components/investing/InvestmentGrid';
import NextIncomeInfo from '@/components/investing/NextIncomeInfo';
import { investmentData } from '@/data/investments';

const Investing: React.FC = () => {
  const { user } = useAuth();
  const [userInvestments, setUserInvestments] = useState(
    user?.ownedProducts ? investmentData.filter(item => 
      user.ownedProducts.some(product => product.productId === item.id)
    ) : []
  );
  
  useEffect(() => {
    if (user && user.ownedProducts) {
      const owned = investmentData.filter(item => 
        user.ownedProducts.some(product => product.productId === item.id)
      );
      setUserInvestments(owned);
    } else {
      setUserInvestments([]);
    }
  }, [user]);

  const totalDailyIncome = userInvestments.reduce((total, item) => total + item.dailyIncome, 0);
  const totalInvestment = userInvestments.reduce((total, item) => total + item.price, 0);

  return (
    <div className="min-h-screen bg-black pb-24">
      <header className="bg-[#333333] py-4">
        <h1 className="text-white text-xl text-center font-medium">— Investing —</h1>
      </header>
      
      <div className="bg-investment-yellow h-2"></div>
      
      <div className="p-4">
        <DailyIncomeHeader 
          totalDailyIncome={totalDailyIncome}
          totalInvestment={totalInvestment}
        />
        
        {user && user.dailyIncome > 0 && (
          <NextIncomeInfo user={user} />
        )}
        
        <h2 className="text-xl text-white font-medium mb-4">— My Investments —</h2>
        
        {userInvestments.length > 0 ? (
          <InvestmentGrid 
            investments={userInvestments}
          />
        ) : (
          <EmptyInvestments />
        )}
      </div>
      
      <Navigation />
    </div>
  );
};

export default Investing;
