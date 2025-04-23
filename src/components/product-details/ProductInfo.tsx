
import React from 'react';

interface ProductInfoProps {
  title: string;
  price: number;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ title, price }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">{title}</h2>
      <p className="text-gray-400 mb-4">
        Select equipment which you prefer! You can share the equipment income bonus every day!
      </p>
      
      <div className="text-investment-gold text-4xl font-bold mb-6">
        ₹{price.toLocaleString()}
      </div>
    </div>
  );
};

export default ProductInfo;
