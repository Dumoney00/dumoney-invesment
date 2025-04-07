
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
    title: "Mining Excavator Alpha",
    image: "https://images.unsplash.com/photo-1605131545453-2c1838d6dbb7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 250.00,
    dailyIncome: 50.00,
    viewCount: 6351,
  },
  {
    id: 2,
    title: "Industrial Drill XL-5000",
    image: "https://images.unsplash.com/photo-1622022526425-b358809cc649?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 800.00,
    dailyIncome: 60.00,
    viewCount: 1730,
  },
  {
    id: 3,
    title: "Mining Crusher S3000",
    image: "https://images.unsplash.com/photo-1513293960556-9fcd584f3a3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 1400.00,
    dailyIncome: 108.00,
    viewCount: 4677,
  },
  {
    id: 4,
    title: "Gold Mining Processor",
    image: "https://images.unsplash.com/photo-1638913662295-9630035ef770?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 5000.00,
    dailyIncome: 417.00,
    viewCount: 4329,
  },
  {
    id: 5,
    title: "Diamond Mining Equipment",
    image: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 3500.00,
    dailyIncome: 280.00,
    viewCount: 2295,
  },
  {
    id: 6,
    title: "Hydraulic Mining Shovel",
    image: "https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 1400.00,
    dailyIncome: 108.00,
    viewCount: 3187,
  },
  {
    id: 7,
    title: "Silver Mining System",
    image: "https://images.unsplash.com/photo-1624987758446-d15141b540c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 2800.00,
    dailyIncome: 224.00,
    viewCount: 2514,
  },
  {
    id: 8,
    title: "Mining Dump Truck",
    image: "https://images.unsplash.com/photo-1569764099715-026ec5511e65?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    price: 4200.00,
    dailyIncome: 336.00,
    viewCount: 1876,
  }
];

const Products: React.FC = () => {
  const { user, isAuthenticated, addOwnedProduct } = useAuth();
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
      // The price deduction now happens in addOwnedProduct
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
      {/* Header */}
      <header className="bg-[#333333] py-4">
        <h1 className="text-white text-xl text-center font-medium">— Products —</h1>
      </header>
      
      <div className="bg-investment-yellow h-2"></div>
      
      {/* Marquee for dynamic info */}
      <div className="overflow-hidden bg-[#222222] py-2 mb-4">
        <div className="whitespace-nowrap animate-marquee">
          <span className="text-investment-gold mx-2">
            New oil rig investments with 8.5% daily returns • Limited mining equipment available • 
            Market update: Gold prices rise 3.1% • Highest yield: Oil Pipeline Network at 8% daily • 
            Withdrawal time: 11:00 AM daily • New users get 5% bonus on first investment •
          </span>
        </div>
      </div>
      
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
