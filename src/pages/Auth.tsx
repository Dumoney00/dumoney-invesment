
import React from 'react';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Auth: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect to home if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-black">
      <AuthForm />
    </div>
  );
};

export default Auth;
