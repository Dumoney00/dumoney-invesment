
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
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('email', email)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
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
