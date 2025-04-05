
import React from 'react';
import { WalletCards, ShoppingBag, ChevronUp, TrendingUp } from 'lucide-react';
import SubMenuButton from './SubMenuButton';

interface FloatingSubmenuProps {
  isOpen: boolean;
  onNavigate: (path: string) => void;
}

const FloatingSubmenu: React.FC<FloatingSubmenuProps> = ({ isOpen, onNavigate }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 animate-fadeIn">
      <SubMenuButton 
        Icon={WalletCards}
        color="green-600"
        onClick={() => onNavigate('/deposit')}
      />
      
      <SubMenuButton 
        Icon={TrendingUp}
        color="blue-600"
        onClick={() => onNavigate('/investing')}
      />
      
      <SubMenuButton 
        Icon={ShoppingBag}
        color="purple-600"
        onClick={() => onNavigate('/products')}
      />
      
      <SubMenuButton 
        Icon={ChevronUp}
        color="yellow-500"
        onClick={() => onNavigate('/')}
      />
    </div>
  );
};

export default FloatingSubmenu;
