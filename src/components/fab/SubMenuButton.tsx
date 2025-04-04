
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SubMenuButtonProps {
  Icon: LucideIcon;
  color: string;
  onClick: () => void;
}

const SubMenuButton: React.FC<SubMenuButtonProps> = ({ Icon, color, onClick }) => {
  return (
    <button 
      className={`bg-${color} h-12 w-12 rounded-full flex items-center justify-center shadow-lg`}
      onClick={onClick}
    >
      <Icon size={20} color="white" />
    </button>
  );
};

export default SubMenuButton;
