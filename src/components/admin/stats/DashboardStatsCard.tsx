
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface DashboardStatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  iconColor: string;
}

const DashboardStatsCard: React.FC<DashboardStatsCardProps> = ({ 
  title, 
  value, 
  subtitle,
  icon: Icon, 
  iconColor 
}) => {
  return (
    <Card className="bg-[#222B45]/80 border-[#33374D]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-white">{value}</h3>
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          </div>
          <div className={`p-2 rounded-lg ${iconColor}`}>
            <Icon size={22} className="text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardStatsCard;
