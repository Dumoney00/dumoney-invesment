
import React, { useState } from 'react';
import { Plus, X, Wallet, ShoppingBag, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 right-1/2 transform translate-x-1/2 z-50">
      {/* Sub buttons - only shown when menu is open */}
      {isOpen && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 animate-fadeIn">
          <button 
            className="bg-green-600 h-12 w-12 rounded-full flex items-center justify-center shadow-lg"
            onClick={() => handleNavigate('/deposit')}
          >
            <Wallet size={20} color="white" />
          </button>
          
          <button 
            className="bg-blue-600 h-12 w-12 rounded-full flex items-center justify-center shadow-lg"
            onClick={() => handleNavigate('/products')}
          >
            <ShoppingBag size={20} color="white" />
          </button>
          
          <button 
            className="bg-purple-600 h-12 w-12 rounded-full flex items-center justify-center shadow-lg"
            onClick={() => handleNavigate('/')}
          >
            <ChevronUp size={20} color="white" />
          </button>
        </div>
      )}
      
      {/* Main FAB button */}
      <button 
        className="bg-investment-gold h-14 w-14 rounded-full flex items-center justify-center shadow-lg"
        onClick={toggleMenu}
      >
        {isOpen ? <X size={30} color="white" /> : <Plus size={30} color="white" />}
      </button>
    </div>
  );
};

export default FloatingActionButton;
