
import { useState } from 'react';
import { User } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { ActivityLoggerResult } from './types';

/**
 * Hook for logging user activities to the database
 */
export const useActivityLogger = (user: User | null): ActivityLoggerResult => {
  const [error, setError] = useState<string | null>(null);

  /**
   * Logs an activity to the database
   */
  const logActivity = async (
    activityType: string,
    details: string | null = null,
    amount: number | null = null
  ): Promise<boolean> => {
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
    logActivity
  };
};
