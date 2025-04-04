
import React from 'react';
import { Wallet, ShoppingBag, ChevronUp } from 'lucide-react';
import SubMenuButton from './SubMenuButton';
import { useNavigate } from 'react-router-dom';

interface FloatingSubmenuProps {
  isOpen: boolean;
  onNavigate: (path: string) => void;
}

const FloatingSubmenu: React.FC<FloatingSubmenuProps> = ({ isOpen, onNavigate }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 animate-fadeIn">
      <SubMenuButton 
        Icon={Wallet}
        color="green-600"
        onClick={() => onNavigate('/deposit')}
      />
      
      <SubMenuButton 
        Icon={ShoppingBag}
        color="blue-600"
        onClick={() => onNavigate('/products')}
      />
      
      <SubMenuButton 
        Icon={ChevronUp}
        color="purple-600"
        onClick={() => onNavigate('/')}
      />
    </div>
  );
};

export default FloatingSubmenu;
