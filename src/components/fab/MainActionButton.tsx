
import React from 'react';
import { Plus, X } from 'lucide-react';

interface MainActionButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MainActionButton: React.FC<MainActionButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button 
      className="bg-investment-gold h-14 w-14 rounded-full flex items-center justify-center shadow-lg"
      onClick={onClick}
    >
      {isOpen ? <X size={30} color="white" /> : <Plus size={30} color="white" />}
    </button>
  );
};

export default MainActionButton;
