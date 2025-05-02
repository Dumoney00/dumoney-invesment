
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActivityFeed from '@/components/home/ActivityFeed';
import ActivityStatsSummary from '@/components/home/ActivityStatsSummary';
import { useAllUserActivities } from '@/hooks/useAllUserActivities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, CalendarRange, Filter, RefreshCcw, Users } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { mapTransactionToActivity } from '@/components/home/ActivityFeed';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const Activities: React.FC = () => {
  const { user } = useAuth();
  const { activities: allUserActivities, stats: activityStats, loading: activitiesLoading, refresh } = useAllUserActivities();
  const [activityFilter, setActivityFilter] = useState<'all' | 'deposit' | 'withdraw' | 'investment'>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{start: Date | null, end: Date | null}>({start: null, end: null});
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'mobile' | 'desktop'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const userActivities = user?.transactions 
    ? user.transactions.map(transaction => mapTransactionToActivity({
        ...transaction,
        userName: user.username,
        userId: user.id
      }))
    : [];

  // Get unique users for filtering
  const uniqueUsers = React.useMemo(() => {
    const users = new Map();
    allUserActivities.forEach(activity => {
      if (!users.has(activity.userId)) {
        users.set(activity.userId, activity.username);
      }
    });
    return Array.from(users).map(([id, name]) => ({ id, name }));
  }, [allUserActivities]);
  
  // Apply date range filtering
  const filteredByDate = React.useMemo(() => {
    if (!dateRange.start && !dateRange.end) return allUserActivities;
    
    return allUserActivities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      if (dateRange.start && dateRange.end) {
        // Set end date to end of day for inclusive filtering
        const endOfDay = new Date(dateRange.end);
        endOfDay.setHours(23, 59, 59, 999);
        return activityDate >= dateRange.start && activityDate <= endOfDay;
      } else if (dateRange.start) {
        return activityDate >= dateRange.start;
      } else if (dateRange.end) {
        // Set end date to end of day for inclusive filtering
        const endOfDay = new Date(dateRange.end);
        endOfDay.setHours(23, 59, 59, 999);
        return activityDate <= endOfDay;
      }
      return true;
    });
  }, [allUserActivities, dateRange]);
  
  // Apply device filtering
  const filteredByDevice = React.useMemo(() => {
    if (deviceFilter === 'all') return filteredByDate;
    
    return filteredByDate.filter(activity => {
      if (!activity.deviceInfo) return false;
      if (deviceFilter === 'mobile') return activity.deviceInfo.type === 'Mobile';
      if (deviceFilter === 'desktop') return activity.deviceInfo.type === 'Desktop';
      return true;
    });
  }, [filteredByDate, deviceFilter]);

  // Check if we have any activities when loaded
  useEffect(() => {
    if (!activitiesLoading && allUserActivities.length === 0) {
      toast({
        title: "No activities found",
        description: "Waiting for activities from all users to appear",
      });
    }
  }, [activitiesLoading, allUserActivities]);

  // Reset date filter
  const resetDateFilter = () => {
    setDateRange({start: null, end: null});
  };
  
  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

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
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-gray-300">Live Activity Feed</CardTitle>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCcw size={18} className={`text-investment-gold ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="sr-only">Refresh</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full bg-[#222222] mb-4">
                <TabsTrigger value="all" className="flex-1">All Users</TabsTrigger>
                <TabsTrigger value="my" className="flex-1">My Activities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {/* Advanced Filtering Options */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  {/* Activity Type Filter */}
                  <Select value={activityFilter} onValueChange={(value) => setActivityFilter(value as any)}>
                    <SelectTrigger className="w-full md:w-36 bg-[#191919]">
                      <SelectValue placeholder="Activity Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="deposit">Deposits</SelectItem>
                      <SelectItem value="withdraw">Withdrawals</SelectItem>
                      <SelectItem value="investment">Purchases</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* User Filter */}
                  <Select value={userFilter} onValueChange={setUserFilter}>
                    <SelectTrigger className="w-full md:w-36 bg-[#191919]">
                      <SelectValue placeholder="Select User" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      {uniqueUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Device Filter */}
                  <Select value={deviceFilter} onValueChange={(value) => setDeviceFilter(value as any)}>
                    <SelectTrigger className="w-full md:w-36 bg-[#191919]">
                      <SelectValue placeholder="Device Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Devices</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="desktop">Desktop</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Date Range Picker */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="bg-[#191919] border-gray-700 text-gray-300">
                        <CalendarRange className="h-4 w-4 mr-2" />
                        {dateRange.start ? format(dateRange.start, 'P') : 'Any'} - 
                        {dateRange.end ? format(dateRange.end, 'P') : 'Any'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="range"
                        selected={{
                          from: dateRange.start || undefined,
                          to: dateRange.end || undefined
                        }}
                        onSelect={(range) => {
                          setDateRange({
                            start: range?.from || null,
                            end: range?.to || null
                          });
                        }}
                        className="bg-[#222] text-white p-3"
                      />
                      <div className="p-3 border-t border-gray-700 flex justify-between">
                        <Button variant="outline" size="sm" onClick={resetDateFilter}>
                          Reset
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="max-h-[60vh] overflow-auto">
                  {activitiesLoading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">Loading activities...</p>
                    </div>
                  ) : (
                    <ActivityFeed 
                      activities={filteredByDevice}
                      showHeader={false}
                      showBankDetails={true}
                      filteredType={activityFilter === 'all' ? 'all' : activityFilter}
                      filteredUserId={userFilter}
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
