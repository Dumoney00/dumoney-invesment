
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface TransactionStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColorClass: string;
}

const TransactionStatsCard: React.FC<TransactionStatsCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColorClass,
}) => {
  return (
    <Card className="bg-[#222B45]/80 border-[#33374D]">
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-white">{value}</h3>
          </div>
          <div className={`${iconColorClass} p-2 rounded-lg`}>
            <Icon size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionStatsCard;
