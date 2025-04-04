
import React from 'react';

const PromoBanner: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <img src="/lovable-uploads/07ba0101-cb9b-416e-9796-7014c2aa2302.png" alt="Join us banner" className="w-full h-48 object-cover" />
      <div className="absolute inset-0 flex flex-col justify-center px-8">
        <h3 className="text-4xl font-bold text-white mb-2">JOIN US</h3>
        <p className="text-white text-lg">
          Develop new energy with us and create a better future together
        </p>
      </div>
    </div>
  );
};

export default PromoBanner;
