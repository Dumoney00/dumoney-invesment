
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Agent from "./pages/Agent";
import Investing from "./pages/Investing";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AuthForm from "./components/AuthForm";
import Transaction from "./pages/Transaction";
import Guide from "./pages/Guide";

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
            <Route path="/products" element={<Products />} />
            <Route path="/agent" element={<Agent />} />
            <Route path="/investing" element={<Investing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/deposit" element={<Transaction />} />
            <Route path="/withdraw" element={<Transaction />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
