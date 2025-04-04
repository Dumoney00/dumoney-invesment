
import React from 'react';
import { Flame } from 'lucide-react';
import InvestmentCard from '@/components/InvestmentCard';

interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  dailyIncome: number;
  viewCount: number;
}

interface FeaturedProductsProps {
  products: Product[];
  startDate: string;
  endDate: string;
  onProductSelect: (product: Product) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ 
  products, 
  startDate, 
  endDate,
  onProductSelect
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Flame className="text-investment-gold" size={24} />
          <h2 className="text-white text-xl font-bold">In Progress</h2>
        </div>
        <div className="text-investment-gold">
          {startDate} to {endDate}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {products.map(product => (
          <InvestmentCard 
            key={product.id} 
            id={product.id} 
            title={product.title} 
            image={product.image} 
            price={product.price} 
            dailyIncome={product.dailyIncome} 
            viewCount={product.viewCount} 
            onInvest={() => onProductSelect(product)} 
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
