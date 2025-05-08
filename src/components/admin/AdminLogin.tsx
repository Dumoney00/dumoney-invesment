
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

interface LoginFormValues {
  email: string;
  password: string;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      console.log("Attempting admin login with email:", values.email);
      
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
      });
      
      if (error) {
        console.error("Sign-in error:", error);
        throw error;
      }

      console.log("Basic login successful, checking admin status");
      
      // Check if the email is in admin_users table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', values.email)
        .maybeSingle();
      
      if (adminError) {
        console.error("Error checking admin_users table:", adminError);
      }
      
      console.log("Admin user check result:", adminData);

      // If not in admin_users, check is_admin flag in users table
      if (!adminData) {
        console.log("User not found in admin_users table, checking is_admin flag");
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('is_admin')
          .eq('email', values.email)
          .maybeSingle();
        
        if (userError) {
          console.error("Error checking users table:", userError);
        }
        
        console.log("User record:", userData);
        
        if (!userData || !userData.is_admin) {
          console.error("User not found in admin_users and not marked as admin in users table");
          await supabase.auth.signOut();
          throw new Error('Not authorized as admin');
        }
      }
      
      console.log("Admin validation successful");
      
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard."
      });
      
      onLoginSuccess();
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Invalid credentials or not authorized as admin");
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials or not authorized as admin",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-[#191919] border border-gray-800 rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-investment-gold/20 p-3 rounded-full">
            <Lock className="h-8 w-8 text-investment-gold" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          Admin Login
        </h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="admin@example.com"
                      className="bg-gray-800 border-gray-700 text-white"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-gray-800 border-gray-700 text-white"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              className="w-full bg-investment-gold hover:bg-investment-gold/90 text-black font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-1">⟳</span>
                  Logging in...
                </>
              ) : 'Login'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AdminLogin;
