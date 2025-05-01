
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
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
  const [error, setError] = useState<string | null>(null);

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

  return {
    error,
    logActivity
  };
};
