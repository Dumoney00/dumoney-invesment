
import React from 'react';
import { Product } from '@/types/products';
import { Eye, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductsListProps {
  products: Product[];
  onProductPurchase: (product: Product) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ products, onProductPurchase }) => {
  return (
    <div className="space-y-3">
      {products.map(product => (
        <div 
          key={product.id} 
          className={`bg-[#222222] p-3 rounded-lg flex items-center ${product.locked ? 'opacity-70' : ''}`}
        >
          <div className="h-16 w-16 mr-3 flex-shrink-0">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          
          <div className="flex-grow min-w-0">
            <h3 className="text-white font-medium text-sm truncate">{product.title}</h3>
            <div className="flex items-center text-xs text-gray-400 mt-1">
              <div className="flex items-center mr-3">
                <Eye size={12} className="mr-1" />
                <span>{(product.viewCount / 1000).toFixed(1)}K</span>
              </div>
              <div className="flex items-center">
                <ArrowUp size={12} className="mr-1 text-green-500" />
                <span className="text-green-500">₹{product.dailyIncome.toFixed(2)}/day</span>
              </div>
            </div>
          </div>
          
          <div className="ml-3 flex flex-col items-end">
            <span className="text-investment-gold font-bold">₹{product.price.toFixed(2)}</span>
            <Button
              variant="outline"
              size="sm"
              className="mt-1 bg-investment-gold hover:bg-investment-gold/80 text-black border-0 text-xs px-2 py-0 h-7"
              onClick={() => onProductPurchase(product)}
              disabled={product.locked}
            >
              Invest
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsList;
