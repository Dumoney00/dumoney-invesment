
import React from 'react';
import InvestmentCard from '@/components/InvestmentCard';
import { Product } from '@/types/products';

interface InvestmentGridProps {
  investments: Product[];
  onSellProduct: (productId: number) => void;
}

const InvestmentGrid: React.FC<InvestmentGridProps> = ({ investments, onSellProduct }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {investments.map((item) => (
        <InvestmentCard
          key={item.id}
          id={item.id}
          title={item.title}
          image={item.image}
          price={item.price}
          dailyIncome={item.dailyIncome}
          cycleDays={item.cycleDays}
          viewCount={0}
          owned={true}
          onSell={() => onSellProduct(item.id)}
        />
      ))}
    </div>
  );
};

export default InvestmentGrid;
