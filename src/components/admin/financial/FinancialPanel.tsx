
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAllUserTransactions } from '@/hooks/useAllUserTransactions';
import TransactionStats from '../transactions/TransactionStats';
import DepositsList from './DepositsList';
import WithdrawalsList from './WithdrawalsList';

const FinancialPanel: React.FC = () => {
  const { transactions } = useAllUserTransactions();
  const [activeTab, setActiveTab] = useState("deposits");
  
  // Filter transactions
  const deposits = transactions.filter(t => t.type === 'deposit');
  const withdrawals = transactions.filter(t => t.type === 'withdraw');
  
  return (
    <div className="space-y-6">
      <TransactionStats transactions={transactions} />
      
      <Card className="bg-[#222B45]/80 border-[#33374D]">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-[#1A1F2C]/80 mb-6 p-1 rounded-lg">
              <TabsTrigger 
                value="deposits" 
                className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
              >
                Deposits
              </TabsTrigger>
              <TabsTrigger 
                value="withdrawals" 
                className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white"
              >
                Withdrawals
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="deposits">
              <DepositsList deposits={deposits} />
            </TabsContent>
            
            <TabsContent value="withdrawals">
              <WithdrawalsList withdrawals={withdrawals} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialPanel;
