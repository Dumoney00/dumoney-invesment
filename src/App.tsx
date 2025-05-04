
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Investing from './pages/Investing';
import Profile from './pages/Profile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster"
import Activities from './pages/Activities';
import Agent from './pages/Agent';
import Account from './pages/Account';
import ChangePassword from './pages/ChangePassword';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';

import MigrationInitiator from './components/migration/MigrationInitiator';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/investing" element={<Investing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/agent" element={<Agent />} />
            <Route path="/account" element={<Account />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MigrationInitiator />
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
