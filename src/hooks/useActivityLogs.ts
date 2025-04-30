
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { showToast } from "@/utils/toastUtils";
import { User } from "@/types/auth";

export interface ActivityLog {
  id: string;
  user_id: string;
  username: string;
  activity_type: 'login' | 'register' | 'deposit' | 'withdraw' | 'purchase' | 'sale' | 'daily_income' | 'logout';
  amount: number | null;
  details: string | null;
  ip_address: string | null;
  created_at: string;
}

export const useActivityLogs = (user: User | null) => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all activities (for admin only)
  const fetchAllActivities = async (limit = 100) => {
    try {
      if (!user?.isAdmin) {
        throw new Error("Unauthorized: Admin access required");
      }
      
      setLoading(true);
      
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      setActivities(data as ActivityLog[]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch activities';
      setError(errorMessage);
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  // Log a new activity
  const logActivity = async (
    activityType: ActivityLog['activity_type'],
    details: string | null = null,
    amount: number | null = null
  ) => {
    if (!user) return false;
    
    try {
      // Get IP address for location tracking
      let ipAddress = null;
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress = data.ip;
      } catch (ipError) {
        console.error('Failed to fetch IP address:', ipError);
      }
      
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          username: user.username,
          activity_type: activityType,
          amount: amount,
          details: details,
          ip_address: ipAddress
        });
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error logging activity:', err);
      return false;
    }
  };

  // Setup realtime subscription (for admin)
  const setupRealtimeSubscription = () => {
    if (!user?.isAdmin) return () => {};
    
    const channel = supabase
      .channel('activity_logs_changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'activity_logs' 
        }, 
        (payload) => {
          setActivities(prev => [payload.new as ActivityLog, ...prev]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  };

  return {
    activities,
    loading,
    error,
    fetchAllActivities,
    logActivity,
    setupRealtimeSubscription
  };
};
