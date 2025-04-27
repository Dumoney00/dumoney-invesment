
import React from 'react';
import { Users, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AgentStats: React.FC = () => {
  return (
    <Card className="bg-[#222222] border-gray-700">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#333333] rounded-lg p-4 flex flex-col items-center">
            <Users size={20} className="text-blue-400 mb-2" />
            <p className="text-xl font-bold text-white">0</p>
            <p className="text-xs text-gray-400">Total Referrals</p>
          </div>
          
          <div className="bg-[#333333] rounded-lg p-4 flex flex-col items-center">
            <TrendingUp size={20} className="text-purple-400 mb-2" />
            <p className="text-xl font-bold text-white">₹0</p>
            <p className="text-xs text-gray-400">Total Earned</p>
          </div>
        </div>
        
        <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
          5% Bonus Rate
        </Badge>
      </CardContent>
    </Card>
  );
};

export default AgentStats;
