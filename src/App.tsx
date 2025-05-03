
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Investing from './pages/Investing';
import Profile from './pages/Profile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster"
import Activities from './pages/Activities';

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
          </Routes>
          <MigrationInitiator />
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
