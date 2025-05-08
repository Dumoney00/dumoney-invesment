
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Loader2 } from 'lucide-react';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if the user is an admin
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.user.email)
          .single();
        
        if (error) {
          console.error("Error checking admin status:", error);
          setIsAuthenticated(true);
          setIsAdmin(false);
        } else if (data) {
          setIsAuthenticated(true);
          setIsAdmin(true);
        } else {
          setIsAuthenticated(true);
          setIsAdmin(false);
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-investment-gold" />
        <p className="mt-2 text-investment-gold">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {!isAuthenticated ? (
        <AdminLogin onLoginSuccess={checkAuth} />
      ) : !isAdmin ? (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-red-500 text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-white mb-4">
              You don't have admin privileges. Please contact the system administrator.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      ) : (
        <AdminDashboard />
      )}
    </div>
  );
};

export default Admin;
