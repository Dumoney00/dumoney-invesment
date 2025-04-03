
import React from 'react';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';

const Products: React.FC = () => {
  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="bg-[#333333] py-4">
        <h1 className="text-white text-xl text-center font-medium">— Products —</h1>
      </header>
      
      {/* Yellow Banner */}
      <div className="bg-investment-yellow h-2"></div>
      
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-xl text-white mb-4">Product List</h2>
        <p className="text-gray-400 text-center px-8">
          Browse our complete catalog of investment products.
        </p>
      </div>
      
      <Navigation />
      <FloatingActionButton />
    </div>
  );
};

export default Products;
