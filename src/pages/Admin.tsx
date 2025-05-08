
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
        // First check if email is directly in admin_users table
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.user.email)
          .single();
        
        if (!adminError && adminData) {
          console.log("User found in admin_users table:", adminData);
          setIsAuthenticated(true);
          setIsAdmin(true);
          toast({
            title: "Admin Access Granted",
            description: "Welcome to the admin dashboard"
          });
          return;
        }
        
        // If not directly in admin_users, check is_admin flag in users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (!userError && userData && userData.is_admin) {
          console.log("User has admin flag in users table:", userData);
          setIsAuthenticated(true);
          setIsAdmin(true);
          toast({
            title: "Admin Access Granted",
            description: "Welcome to the admin dashboard"
          });
        } else {
          console.log("User authenticated but not admin:", userData);
          setIsAuthenticated(true);
          setIsAdmin(false);
        }
      } else {
        console.log("No session found");
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
