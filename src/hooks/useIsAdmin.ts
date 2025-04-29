
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useIsAdmin = (email: string | undefined) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIsAdmin = async () => {
      if (!email) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // First, check the admin_users table
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('email', email)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          // Check if an entry was found
          setIsAdmin(!!data);
          
          // If this is the predefined admin email, ensure it exists in admin_users
          if (email === 'dvenkatkaka001@gmail.com' && !data) {
            // Insert the email into admin_users if not already there
            await supabase
              .from('admin_users')
              .insert({ email: 'dvenkatkaka001@gmail.com' });
              
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkIsAdmin();
  }, [email]);

  return { isAdmin, loading };
};
