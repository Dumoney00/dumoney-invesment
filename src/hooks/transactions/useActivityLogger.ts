
import { User } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for logging user activities to the database
 */
export const useActivityLogger = (user: User | null) => {
  /**
   * Logs an activity to the database
   */
  const logActivity = async (
    activityType: string,
    details: string,
    amount: number | null = null
  ) => {
    if (!user) return;
    
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
      
      await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          username: user.username,
          activity_type: activityType,
          amount: amount,
          details: details,
          ip_address: ipAddress
        });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  return {
    logActivity
  };
};
