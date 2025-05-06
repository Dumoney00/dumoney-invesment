
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
import ActivityFeed from '@/components/home/ActivityFeed';
import { mapTransactionToActivity } from '@/types/activity';
import ActivityStatsSummary from '@/components/home/ActivityStatsSummary';
import LiveStockChart from '@/components/home/LiveStockChart';
import { useAllUserActivities } from '@/hooks/useAllUserActivities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Activity, Users, ArrowDown, ArrowUp, IndianRupee, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { motion } from "framer-motion";

const Index: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<typeof investmentData[0] | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const { activities: allUserActivities, stats: activityStats, loading: activitiesLoading, refresh } = useAllUserActivities();
  const [showActivitiesDrawer, setShowActivitiesDrawer] = useState(false);
  const [activityFilter, setActivityFilter] = useState<'all' | 'deposit' | 'withdraw' | 'investment'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    
  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      <HeaderSection />
      
      <AccountSummary user={user} />
      
      <div className="px-4 mb-6">
        <PromoBanner />
      </div>
      
      <QuickActions />
      
      {/* Live Activity Feed */}
      <div className="px-4 mb-6">
        <Card className="bg-[#111111] border-gray-800 shadow-md overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-gray-300 flex items-center gap-2">
                <Activity size={18} className="text-investment-gold" />
                Live Activity Feed
              </CardTitle>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCcw size={18} className={`text-investment-gold ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-2">
            <ActivityFeed 
              activities={allUserActivities.slice(0, 3)} 
              showHeader={false}
              maxHeight="150px"
            />
            <div className="mt-2 text-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs" 
                onClick={() => navigate('/activities')}
              >
                View All Activities
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
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
      
      {/* User Activities Button - Fixed at bottom right */}
      <Drawer open={showActivitiesDrawer} onOpenChange={setShowActivitiesDrawer}>
        <DrawerTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="fixed bottom-20 right-4 z-40 rounded-full h-14 w-14 p-0 shadow-lg bg-investment-gold hover:bg-investment-gold/90"
              aria-label="View all user activities"
            >
              <Activity size={24} />
            </Button>
          </motion.div>
        </DrawerTrigger>
        <DrawerContent className="bg-black border-t border-gray-800 max-h-[90vh]">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Users size={20} />
                User Activities
              </h2>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm">Close</Button>
              </DrawerClose>
            </div>
            
            {/* Activity Stats */}
            <ActivityStatsSummary stats={activityStats} />
            
            <Card className="bg-[#111111] border-gray-800 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-lg text-gray-300">Live Activity Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="w-full bg-[#222222] mb-4">
                    <TabsTrigger value="all" className="flex-1">All Users</TabsTrigger>
                    <TabsTrigger value="my" className="flex-1">My Activities</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    {/* Activity Type Filter */}
                    <Tabs defaultValue={activityFilter} onValueChange={(v) => setActivityFilter(v as any)} className="w-full mb-4">
                      <TabsList className="w-full bg-[#191919] grid grid-cols-4">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="deposit" className="flex items-center justify-center gap-1">
                          <ArrowDown className="h-3 w-3" /> Deposits
                        </TabsTrigger>
                        <TabsTrigger value="withdraw" className="flex items-center justify-center gap-1">
                          <ArrowUp className="h-3 w-3" /> Withdrawals
                        </TabsTrigger>
                        <TabsTrigger value="investment" className="flex items-center justify-center gap-1">
                          <IndianRupee className="h-3 w-3" /> Purchases
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    
                    <div className="max-h-[50vh] overflow-auto">
                      {activitiesLoading ? (
                        <div className="text-center py-8">
                          <p className="text-gray-400">Loading activities...</p>
                        </div>
                      ) : (
                        <ActivityFeed 
                          activities={allUserActivities.slice(0, 20)}
                          showHeader={false}
                          showBankDetails={true}
                          filteredType={activityFilter === 'all' ? 'all' : activityFilter}
                        />
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="my" className="max-h-[60vh] overflow-auto">
                    <ActivityFeed 
                      activities={userActivities.slice(0, 10)}
                      showHeader={false}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </DrawerContent>
      </Drawer>
      
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
