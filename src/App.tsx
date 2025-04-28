
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Agent from "./pages/Agent";
import Investing from "./pages/Investing";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import ChangePassword from "./pages/ChangePassword";
import NotFound from "./pages/NotFound";
import AuthForm from "./components/AuthForm";
import Guide from "./pages/Guide";
import Transaction from "./pages/Transaction";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/agent" element={<Agent />} />
            <Route path="/investing" element={<Investing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/account" element={<Account />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/deposit" element={<Transaction />} />
            <Route path="/withdraw" element={<Transaction />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
