
import React, { useState } from 'react';
import InvestmentCard from '@/components/InvestmentCard';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import { Flame } from 'lucide-react';

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
];

const Index: React.FC = () => {
  const currentDate = new Date();
  const endDate = new Date();
  endDate.setDate(currentDate.getDate() + 4);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="bg-[#333333] py-4">
        <h1 className="text-white text-xl text-center font-medium">— Product List —</h1>
      </header>
      
      {/* Yellow Banner */}
      <div className="bg-investment-yellow h-2"></div>
      
      {/* In Progress Section */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Flame className="text-investment-gold" size={24} />
            <h2 className="text-white text-xl font-bold">In Progress</h2>
          </div>
          <div className="text-investment-gold">
            {formatDate(currentDate)} to {formatDate(endDate)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {investmentData.map(item => (
            <InvestmentCard 
              key={item.id}
              id={item.id}
              title={item.title}
              image={item.image}
              price={item.price}
              dailyIncome={item.dailyIncome}
              viewCount={item.viewCount}
            />
          ))}
        </div>
      </div>
      
      {/* Navigation */}
      <Navigation />
      
      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};

export default Index;
