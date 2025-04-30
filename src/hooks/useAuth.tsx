
import React from 'react';
import { useBasicAuth } from './useBasicAuth';
import { AuthService } from "@/types/auth-service";
import { showToast } from '@/utils/toastUtils';
import { supabase } from "@/integrations/supabase/client";

export const useAuth = (): AuthService => {
  const {
    user,
    isAuthenticated,
    saveUser,
    login: basicLogin,
    register: basicRegister,
    logout: basicLogout,
    resetPassword
  } = useBasicAuth();
  
  // Enhanced login with activity logging
  const login = async (emailOrPhone: string, password: string) => {
    const success = await basicLogin(emailOrPhone, password);
    
    // Log activity after successful login
    if (success && user) {
      try {
        await supabase
          .from('activity_logs')
          .insert({
            user_id: user.id,
            username: user.username,
            activity_type: 'login',
            details: `Logged in with ${emailOrPhone.includes('@') ? 'email' : 'phone'}`,
            ip_address: await fetchIpAddress() // Get IP address for location tracking
          });
      } catch (error) {
        console.error('Failed to log login activity', error);
      }
    }
    
    return success;
  };
  
  // Enhanced register with activity logging
  const register = async (
    username: string, 
    email: string, 
    phone: string, 
    password: string,
    referralCode?: string
  ) => {
    const success = await basicRegister(username, email, phone, password, referralCode);
    
    // Log activity after successful registration
    if (success && user) {
      try {
        await supabase
          .from('activity_logs')
          .insert({
            user_id: user.id,
            username: user.username,
            activity_type: 'register',
            details: referralCode ? `Registered with referral code: ${referralCode}` : 'New registration',
            ip_address: await fetchIpAddress() // Get IP address for location tracking
          });
      } catch (error) {
        console.error('Failed to log register activity', error);
      }
    }
    
    return success;
  };
  
  // Enhanced logout with activity logging
  const logout = () => {
    // Log activity before logout (if user is authenticated)
    if (user) {
      try {
        // Use async/await pattern with try/catch instead of promise.catch()
        (async () => {
          try {
            await supabase
              .from('activity_logs')
              .insert({
                user_id: user.id,
                username: user.username,
                activity_type: 'logout',
                details: 'User logged out',
                ip_address: await fetchIpAddress() // Get IP address for location tracking
              });
            
            console.log('Logout activity logged');
          } catch (error) {
            console.error('Failed to log logout activity', error);
          }
          
          // Proceed with normal logout after logging activity (success or failure)
          basicLogout();
        })();
      } catch (error) {
        console.error('Failed to initiate logout activity logging', error);
        basicLogout(); // Still logout even if activity logging fails
      }
    } else {
      // If no user, just perform the logout
      basicLogout();
    }
  };

  // Utility function to get user's IP address
  const fetchIpAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Failed to fetch IP address:', error);
      return null;
    }
  };

  return {
    user,
    isAuthenticated,
    saveUser,
    login,
    register,
    logout,
    resetPassword
  };
};
