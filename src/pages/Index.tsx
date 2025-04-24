
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import ProductDetailsDialog from '@/components/ProductDetailsDialog';

// Import our components
import HeaderSection from '@/components/home/HeaderSection';
import AccountSummary from '@/components/home/AccountSummary';
import AnnouncementBar from '@/components/home/AnnouncementBar';
import PromoBanner from '@/components/home/PromoBanner';
import QuickActions from '@/components/home/QuickActions';
import InviteCard from '@/components/home/InviteCard';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import ActivityFeed from '@/components/home/ActivityFeed';
import { investmentData } from '@/data/investments';

// Activity feed data
const activityFeed = [
  {
    id: 1,
    username: "User 01******1565",
    amount: 9042.00
  }, 
  {
    id: 2,
    username: "User 01******4154",
    amount: 8146.00
  }, 
  {
    id: 3,
    username: "User 01******7823",
    amount: 4822.00
  }, 
  {
    id: 4,
    username: "User 01******9974",
    amount: 6331.00
  }, 
  {
    id: 5,
    username: "User 01******2246",
    amount: 7510.00
  }
];

const Index: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<typeof investmentData[0] | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  
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
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const handleInvestmentSuccess = () => {
    navigate('/investing');
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
      
      {selectedProduct && (
        <ProductDetailsDialog
          open={showProductDetails}
          onOpenChange={setShowProductDetails}
          product={selectedProduct}
          onConfirmInvest={handleInvestmentSuccess}
        />
      )}
      
      <Navigation />
      
      <FloatingActionButton />
    </div>
  );
};

export default Index;
