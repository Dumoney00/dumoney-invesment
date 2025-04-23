import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import SearchBar from '@/components/products/SearchBar';
import SortSelector from '@/components/products/SortSelector';
import ProductsGrid from '@/components/products/ProductsGrid';
import MarqueeText from '@/components/products/MarqueeText';
import { Product } from '@/types/products';

const allInvestmentData: Product[] = [
  {
    id: 1,
    title: "Oil Refinery Processing Unit",
    image: "/lovable-uploads/39854854-dee8-4bf0-a045-eff7813c1370.png",
    price: 1200.00,
    dailyIncome: 40.00,
    cycleDays: 45,
    viewCount: 6351,
    locked: false,
  },
  {
    id: 2,
    title: "Industrial Gas Processing Plant",
    image: "/lovable-uploads/1541f643-6e7a-4b1f-b83a-533eb61d205f.png",
    price: 2400.00,
    dailyIncome: 80.00,
    cycleDays: 45,
    viewCount: 1730,
    locked: false,
  },
  {
    id: 3,
    title: "Pipeline Network System",
    image: "/lovable-uploads/4b9b18f6-756a-4f3b-aafc-0f0501a3ce42.png",
    price: 4800.00,
    dailyIncome: 160.00,
    cycleDays: 45,
    viewCount: 4677,
    locked: false,
  },
  {
    id: 4,
    title: "Mining Processing Facility",
    image: "/lovable-uploads/5ac44beb-15bc-49ee-8192-f6369f2e9ba1.png",
    price: 10000.00,
    dailyIncome: 500.00,
    cycleDays: 30,
    viewCount: 4329,
    locked: true,
    requiredProductId: 1,
  },
  {
    id: 5,
    title: "Gold Processing Plant",
    image: "/lovable-uploads/d21fc3fe-5410-4485-b5e2-bfeed3f04d3f.png",
    price: 12000.00,
    dailyIncome: 700.00,
    cycleDays: 30,
    viewCount: 2295,
    locked: true,
    requiredProductId: 2,
  },
  {
    id: 6,
    title: "Oil Field Equipment",
    image: "/lovable-uploads/cdc5ad7e-14e7-41a9-80df-35f3af265a34.png",
    price: 15000.00,
    dailyIncome: 900.00,
    cycleDays: 30,
    viewCount: 3187,
    locked: true,
    requiredProductId: 3,
  },
  {
    id: 7,
    title: "Mineral Extraction System",
    image: "/lovable-uploads/c71c2543-3f57-4302-b98f-e5030facc992.png",
    price: 18000.00,
    dailyIncome: 1200.00,
    cycleDays: 30,
    viewCount: 2514,
    locked: true,
    requiredProductId: 4,
  },
  {
    id: 8,
    title: "Heavy Mining Excavator",
    image: "/lovable-uploads/e5629de9-3d0b-4460-b0c5-fdf1020e6864.png",
    price: 22000.00,
    dailyIncome: 1500.00,
    cycleDays: 30,
    viewCount: 1876,
    locked: true,
    requiredProductId: 5,
  }
];

const Products: React.FC = () => {
  const { user, isAuthenticated, addOwnedProduct } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState(allInvestmentData);
  const [sortOption, setSortOption] = useState<string>('default');

  useEffect(() => {
    let availableProducts = [...allInvestmentData];
    
    if (user && user.ownedProducts) {
      availableProducts = availableProducts.map(product => {
        if (product.locked && product.requiredProductId && 
            user.ownedProducts.includes(product.requiredProductId)) {
          return { ...product, locked: false };
        }
        return product;
      });
    }
    
    const filtered = availableProducts.filter(product => 
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    let sorted = [...filtered];
    switch(sortOption) {
      case 'priceAsc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'incomeAsc':
        sorted.sort((a, b) => a.dailyIncome - b.dailyIncome);
        break;
      case 'incomeDesc':
        sorted.sort((a, b) => b.dailyIncome - a.dailyIncome);
        break;
      case 'popularity':
        sorted.sort((a, b) => b.viewCount - a.viewCount);
        break;
    }
    
    setFilteredProducts(sorted);
  }, [searchTerm, sortOption, user]);

  const handleProductPurchase = (product: Product) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to purchase products",
        variant: "destructive"
      });
      return;
    }

    if (product.locked) {
      toast({
        title: "Product Locked",
        description: `Complete the required investment first to unlock this product`,
        variant: "destructive"
      });
      return;
    }

    if (user && user.balance >= product.price) {
      addOwnedProduct(product.id, product.price);
      toast({
        title: "Purchase Successful",
        description: `You have purchased ${product.title}`,
      });
    } else {
      toast({
        title: "Insufficient Funds",
        description: "Please deposit more funds to make this purchase",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      <header className="bg-[#333333] py-4">
        <h1 className="text-white text-xl text-center font-medium">— Products —</h1>
      </header>
      
      <div className="bg-investment-yellow h-2"></div>
      
      <MarqueeText />
      
      <div className="p-4">
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <SortSelector 
          value={sortOption}
          onChange={setSortOption}
        />
        
        <ProductsGrid 
          products={filteredProducts}
          onProductPurchase={handleProductPurchase}
        />
      </div>
      
      <Navigation />
      <FloatingActionButton />
    </div>
  );
};

export default Products;
