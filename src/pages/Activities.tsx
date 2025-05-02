
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActivityFeed from '@/components/home/ActivityFeed';
import ActivityStatsSummary from '@/components/home/ActivityStatsSummary';
import { useAllUserActivities } from '@/hooks/useAllUserActivities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, IndianRupee, Users } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { mapTransactionToActivity } from '@/components/home/ActivityFeed';
import { toast } from '@/components/ui/use-toast';

const Activities: React.FC = () => {
  const { user } = useAuth();
  const { activities: allUserActivities, stats: activityStats, loading: activitiesLoading } = useAllUserActivities();
  const [activityFilter, setActivityFilter] = useState<'all' | 'deposit' | 'withdraw' | 'investment'>('all');
  
  const userActivities = user?.transactions 
    ? user.transactions.map(transaction => mapTransactionToActivity({
        ...transaction,
        userName: user.username
      }))
    : [];

  // Check if we have any activities when loaded
  React.useEffect(() => {
    if (!activitiesLoading && allUserActivities.length === 0) {
      toast({
        title: "No activities found",
        description: "Waiting for activities from all users to appear",
      });
    }
  }, [activitiesLoading, allUserActivities]);

  return (
    <div className="min-h-screen bg-black pb-24">
      <div className="pt-4 px-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-2xl font-bold">Activities</h1>
          <div className="flex items-center">
            <Users size={18} className="text-investment-gold mr-2" />
            <span className="text-sm text-investment-gold">User Activities</span>
          </div>
        </div>

        <ActivityStatsSummary stats={activityStats} />
        
        <Card className="bg-[#111111] border-gray-800 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-lg text-gray-300">Live Activity Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full bg-[#222222] mb-4">
                <TabsTrigger value="all" className="flex-1">All Users</TabsTrigger>
                <TabsTrigger value="my" className="flex-1">My Activities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {/* Activity Type Filter */}
                <Tabs defaultValue={activityFilter} onValueChange={(v) => setActivityFilter(v as any)} className="w-full mb-4">
                  <TabsList className="w-full bg-[#191919] grid grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="deposit" className="flex items-center justify-center gap-1">
                      <ArrowDown className="h-3 w-3" /> Deposits
                    </TabsTrigger>
                    <TabsTrigger value="withdraw" className="flex items-center justify-center gap-1">
                      <ArrowUp className="h-3 w-3" /> Withdrawals
                    </TabsTrigger>
                    <TabsTrigger value="investment" className="flex items-center justify-center gap-1">
                      <IndianRupee className="h-3 w-3" /> Purchases
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="max-h-[60vh] overflow-auto">
                  {activitiesLoading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">Loading activities...</p>
                    </div>
                  ) : (
                    <ActivityFeed 
                      activities={allUserActivities}
                      showHeader={false}
                      showBankDetails={true}
                      filteredType={activityFilter === 'all' ? 'all' : activityFilter}
                    />
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="my" className="max-h-[60vh] overflow-auto">
                <ActivityFeed 
                  activities={userActivities}
                  showHeader={false}
                  showBankDetails={true}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Activities;
