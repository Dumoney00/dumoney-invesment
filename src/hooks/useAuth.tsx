
import React from 'react';
import { useBasicAuth } from './useBasicAuth';
import { AuthService } from "@/types/auth-service";
import { showToast } from '@/utils/toastUtils';

export const useAuth = (): AuthService => {
  const {
    user,
    isAuthenticated,
    saveUser,
    login,
    register,
    logout,
    resetPassword
  } = useBasicAuth();

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
