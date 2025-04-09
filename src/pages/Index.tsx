
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
  title: "Oil Refinery Processing Unit",
  image: "/lovable-uploads/39854854-dee8-4bf0-a045-eff7813c1370.png",
  price: 250.00,
  dailyIncome: 50.00,
  viewCount: 6351
}, {
  id: 2,
  title: "Industrial Gas Processing Plant",
  image: "/lovable-uploads/1541f643-6e7a-4b1f-b83a-533eb61d205f.png",
  price: 800.00,
  dailyIncome: 60.00,
  viewCount: 1730
}, {
  id: 3,
  title: "Pipeline Network System",
  image: "/lovable-uploads/4b9b18f6-756a-4f3b-aafc-0f0501a3ce42.png",
  price: 1400.00,
  dailyIncome: 108.00,
  viewCount: 4677
}, {
  id: 4,
  title: "Mining Processing Facility",
  image: "/lovable-uploads/5ac44beb-15bc-49ee-8192-f6369f2e9ba1.png",
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
