
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
import ProductsList from '@/components/products/ProductsList';
import SearchBar from '@/components/products/SearchBar';
import SortSelector from '@/components/products/SortSelector';
import ViewToggle, { ViewMode } from '@/components/home/ViewToggle';
import { investmentData } from '@/data/investments';
import ActivityFeed, { mapTransactionToActivity } from '@/components/home/ActivityFeed';
import LiveStockChart from '@/components/home/LiveStockChart';
import { useAllUserActivities } from '@/hooks/useAllUserActivities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<typeof investmentData[0] | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const { activities: allUserActivities, loading: activitiesLoading } = useAllUserActivities();

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

  const userActivities = user?.transactions 
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
        <div className="flex justify-between items-center mb-4">
          <SortSelector
            value={sortBy}
            onChange={setSortBy}
          />
          <ViewToggle 
            viewMode={viewMode}
            onViewChange={setViewMode}
          />
        </div>
        
        {viewMode === 'grid' ? (
          <ProductsGrid 
            products={filteredProducts}
            onProductPurchase={handleProductPurchase}
          />
        ) : (
          <ProductsList 
            products={filteredProducts}
            onProductPurchase={handleProductPurchase}
          />
        )}
      </div>
      
      <div className="p-4 mt-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full bg-[#333333] mb-4">
            <TabsTrigger value="all" className="flex-1">All Activities</TabsTrigger>
            <TabsTrigger value="my" className="flex-1">My Activities</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <h2 className="text-center text-gray-400 mb-4 text-lg">— Latest User Activities —</h2>
            {activitiesLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Loading activities...</p>
              </div>
            ) : (
              <ActivityFeed 
                activities={allUserActivities.slice(0, 10)}
                showHeader={false}
                showBankDetails={true}
              />
            )}
          </TabsContent>
          <TabsContent value="my">
            <ActivityFeed 
              activities={userActivities.slice(0, 5)}
              showHeader={true}
            />
          </TabsContent>
        </Tabs>
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
