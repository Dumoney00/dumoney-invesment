import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';
import InvestmentCard from '@/components/InvestmentCard';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

const allInvestmentData = [
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
  {
    id: 6,
    title: "Fractionation Column Alpha",
    image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 1200.00,
    dailyIncome: 96.00,
    viewCount: 3187,
  },
  {
    id: 7,
    title: "Hydrocracking Unit XL",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 2800.00,
    dailyIncome: 224.00,
    viewCount: 2514,
  },
  {
    id: 8,
    title: "Coker Processing System",
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 4200.00,
    dailyIncome: 336.00,
    viewCount: 1876,
  }
];

const Products: React.FC = () => {
  const { user, isAuthenticated, updateUserBalance, addOwnedProduct } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState(allInvestmentData);
  const [sortOption, setSortOption] = useState<string>('default');

  useEffect(() => {
    const filtered = allInvestmentData.filter(product => 
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
  }, [searchTerm, sortOption]);

  const handleProductPurchase = (product: typeof allInvestmentData[0]) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to purchase products",
        variant: "destructive"
      });
      return;
    }

    if (user && user.balance >= product.price) {
      updateUserBalance(-product.price);
      addOwnedProduct(product.id);
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
      
      <div className="p-4">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#222222] border-gray-700 text-white"
          />
        </div>
        
        <div className="flex justify-end mb-4">
          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-[#222222] text-white border border-gray-700 rounded-md px-3 py-1 text-sm"
          >
            <option value="default">Sort By</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="incomeAsc">Income: Low to High</option>
            <option value="incomeDesc">Income: High to Low</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <InvestmentCard 
                key={product.id}
                id={product.id}
                title={product.title}
                image={product.image}
                price={product.price}
                dailyIncome={product.dailyIncome}
                viewCount={product.viewCount}
                onInvest={() => handleProductPurchase(product)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-400 text-center">No products match your search</p>
          </div>
        )}
      </div>
      
      <Navigation />
      <FloatingActionButton />
    </div>
  );
};

export default Products;
