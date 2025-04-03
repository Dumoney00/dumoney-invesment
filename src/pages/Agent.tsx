
import React from 'react';
import Navigation from '@/components/Navigation';
import FloatingActionButton from '@/components/FloatingActionButton';

const Agent: React.FC = () => {
  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="bg-[#333333] py-4">
        <h1 className="text-white text-xl text-center font-medium">— Agent —</h1>
      </header>
      
      {/* Yellow Banner */}
      <div className="bg-investment-yellow h-2"></div>
      
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-xl text-white mb-4">Contact an Agent</h2>
        <p className="text-gray-400 text-center px-8">
          Connect with our investment specialists for personalized guidance.
        </p>
      </div>
      
      <Navigation />
      <FloatingActionButton />
    </div>
  );
};

export default Agent;
