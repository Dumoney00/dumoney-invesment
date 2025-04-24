
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import ProductDetailsDialog from '@/components/ProductDetailsDialog';
import HeaderSection from '@/components/home/HeaderSection';
import AccountSummary from '@/components/home/AccountSummary';
import AnnouncementBar from '@/components/home/AnnouncementBar';
import PromoBanner from '@/components/home/PromoBanner';
import QuickActions from '@/components/home/QuickActions';
import InviteCard from '@/components/home/InviteCard';
import ActivityFeed, { Activity } from '@/components/home/ActivityFeed';
import ProductsGrid from '@/components/products/ProductsGrid';
import SearchBar from '@/components/products/SearchBar';
import SortSelector from '@/components/products/SortSelector';
import { investmentData } from '@/data/investments';

const Index: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<typeof investmentData[0] | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');

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

  const filteredProducts = investmentData
    .filter(product => 
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'incomeAsc':
          return a.dailyIncome - b.dailyIncome;
        case 'incomeDesc':
          return b.dailyIncome - a.dailyIncome;
        case 'popularity':
          return b.viewCount - a.viewCount;
        default:
          return 0;
      }
    });

  const activities: Activity[] = user?.transactions?.map(transaction => ({
    id: transaction.id,
    username: user.username,
    amount: transaction.amount,
    type: transaction.type === 'purchase' ? 'investment' : transaction.type,
    timestamp: transaction.timestamp
  })) || [];

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
      
      <div className="px-4">
        <h2 className="text-xl text-white font-medium mb-4">— All Products —</h2>
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <SortSelector
          value={sortBy}
          onChange={setSortBy}
        />
        <ProductsGrid 
          products={filteredProducts}
          onProductPurchase={handleProductPurchase}
        />
      </div>
      
      <div className="p-4 mt-6">
        <ActivityFeed 
          activities={activities.slice(0, 5)}
          showHeader={true}
        />
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
