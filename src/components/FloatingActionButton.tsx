
import React from 'react';
import { Plus } from 'lucide-react';

const FloatingActionButton: React.FC = () => {
  return (
    <div className="fixed bottom-20 right-1/2 transform translate-x-1/2 z-50">
      <button 
        className="bg-investment-gold h-14 w-14 rounded-full flex items-center justify-center shadow-lg"
        onClick={() => console.log('FAB clicked')}
      >
        <Plus size={30} color="white" />
      </button>
    </div>
  );
};

export default FloatingActionButton;
