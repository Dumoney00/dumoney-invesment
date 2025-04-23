
import React from 'react';
import InvestmentCard from '@/components/InvestmentCard';
import { Product } from '@/types/products';

interface ProductsGridProps {
  products: Product[];
  onProductPurchase: (product: Product) => void;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ products, onProductPurchase }) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-400 text-center">No products match your search</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map(product => (
        <InvestmentCard 
          key={product.id}
          id={product.id}
          title={product.title}
          image={product.image}
          price={product.price}
          dailyIncome={product.dailyIncome}
          cycleDays={product.cycleDays}
          viewCount={product.viewCount}
          locked={product.locked}
          onInvest={() => onProductPurchase(product)}
        />
      ))}
    </div>
  );
};

export default ProductsGrid;
