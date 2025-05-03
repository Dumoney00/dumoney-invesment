
import React from 'react';
import { Activity } from '@/types/activity';

interface ActivityIconProps {
  type: Activity['type'];
  className?: string;
}

const ActivityIcon: React.FC<ActivityIconProps> = ({ type, className = "w-full h-full object-contain" }) => {
  const getIconPath = () => {
    switch (type) {
      case 'deposit':
        return "/lovable-uploads/6efabb52-cf50-45d0-b356-7f37c5c2003a.png";
      case 'withdraw':
        return "/lovable-uploads/e64e27ed-2f37-48aa-a277-fd7ad33b2e87.png";
      case 'investment':
        return "/lovable-uploads/4b9b18f6-756a-4f3b-aafc-0f0501a3ce42.png";
      case 'sale':
        return "/lovable-uploads/e5629de9-3d0b-4460-b0c5-fdf1020e6864.png";
      case 'dailyIncome':
        return "/lovable-uploads/07ba0101-cb9b-416e-9796-7014c2aa2302.png";
      case 'referralBonus':
        return "/lovable-uploads/39854854-dee8-4bf0-a045-eff7813c1370.png";
      default:
        return "/lovable-uploads/5315140b-b55c-4211-85e0-8b4d86ed8ace.png";
    }
  };

  return <img src={getIconPath()} alt={`${type} icon`} className={className} />;
};

export default ActivityIcon;
