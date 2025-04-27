import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import ProductDetailsDialog from '@/components/ProductDetailsDialog';
import HeaderSection from '@/components/home/HeaderSection';
import AccountSummary from '@/components/home/AccountSummary';
import PromoBanner from '@/components/home/PromoBanner';
import QuickActions from '@/components/home/QuickActions';
import ProductsGrid from '@/components/products/ProductsGrid';
import SearchBar from '@/components/products/SearchBar';
import SortSelector from '@/components/products/SortSelector';
import { investmentData } from '@/data/investments';
import ActivityFeed, { mapTransactionToActivity } from '@/components/home/ActivityFeed';
import LiveStockChart from '@/components/home/LiveStockChart';

const Index: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<typeof investmentData[0] | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleProductPurchase = (product: typeof investmentData[0]) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setSelectedProduct(product);
    setShowProductDetails(true);
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

  const activities = user?.transactions 
    ? user.transactions.map(transaction => mapTransactionToActivity({
        ...transaction,
        userName: user.username
      }))
    : [];

  return (
    <div className="min-h-screen bg-black pb-24">
      <HeaderSection />
      
      <AccountSummary user={user} />
      
      <div className="px-4 mb-6">
        <PromoBanner />
      </div>
      
      <QuickActions />
      
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
      
      <div className="px-4 mb-20">
        <LiveStockChart />
      </div>
      
      {selectedProduct && (
        <ProductDetailsDialog
          open={showProductDetails}
          onOpenChange={setShowProductDetails}
          product={selectedProduct}
          onConfirmInvest={() => navigate('/investing')}
        />
      )}
      
      <Navigation />
      
      <FloatingActionButton />
    </div>
  );
};

export default Index;
