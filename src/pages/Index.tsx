
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';

// Import our new components
import HeaderSection from '@/components/home/HeaderSection';
import AccountSummary from '@/components/home/AccountSummary';
import AnnouncementBar from '@/components/home/AnnouncementBar';
import PromoBanner from '@/components/home/PromoBanner';
import QuickActions from '@/components/home/QuickActions';
import InviteCard from '@/components/home/InviteCard';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import ActivityFeed from '@/components/home/ActivityFeed';

// Data for the products and activities
const investmentData = [{
  id: 1,
  title: "Catalytic Reforming Reactor #1",
  image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
  price: 250.00,
  dailyIncome: 50.00,
  viewCount: 6351
}, {
  id: 2,
  title: "Catalytic Reforming Reactor #2",
  image: "https://images.unsplash.com/photo-1579784265015-1272f5d28154?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
  price: 800.00,
  dailyIncome: 60.00,
  viewCount: 1730
}, {
  id: 3,
  title: "Catalytic Reforming Reactor #3",
  image: "https://images.unsplash.com/photo-1525093127870-67be6104d8a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
  price: 1400.00,
  dailyIncome: 108.00,
  viewCount: 4677
}, {
  id: 4,
  title: "Catalytic Reforming Reactor #4",
  image: "https://images.unsplash.com/photo-1578256420811-3a73e8286fb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
  price: 5000.00,
  dailyIncome: 417.00,
  viewCount: 4329
}];

const activityFeed = [{
  id: 1,
  username: "User 01******1565",
  amount: 9042.00
}, {
  id: 2,
  username: "User 01******4154",
  amount: 8146.00
}, {
  id: 3,
  username: "User 01******7823",
  amount: 4822.00
}, {
  id: 4,
  username: "User 01******9974",
  amount: 6331.00
}, {
  id: 5,
  username: "User 01******2246",
  amount: 7510.00
}];

const Index: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Format dates for featured products section
  const currentDate = new Date();
  const endDate = new Date();
  endDate.setDate(currentDate.getDate() + 4);
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  const handleProductPurchase = (product: typeof investmentData[0]) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      <HeaderSection />
      
      <AccountSummary user={user} />
      
      <div className="px-4 mb-4">
        <AnnouncementBar 
          isAuthenticated={isAuthenticated} 
          username={user?.username} 
        />
      </div>
      
      <div className="px-4 mb-6">
        <PromoBanner />
      </div>
      
      <QuickActions />
      
      <div className="px-4 mb-6">
        <InviteCard 
          isAuthenticated={isAuthenticated} 
          userId={user?.id} 
        />
      </div>
      
      <div className="p-4">
        <FeaturedProducts 
          products={investmentData}
          startDate={formatDate(currentDate)}
          endDate={formatDate(endDate)}
          onProductSelect={handleProductPurchase}
        />
      </div>
      
      <div className="p-4">
        <ActivityFeed activities={activityFeed} />
      </div>
      
      <Navigation />
      
      <FloatingActionButton />
    </div>
  );
};

export default Index;
