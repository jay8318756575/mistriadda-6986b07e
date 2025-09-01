
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Videos from "./pages/Videos";
import VideoFeed from "./pages/VideoFeed";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import DriverRegister from "./pages/DriverRegister";
import CustomerRegister from "./pages/CustomerRegister";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/driver-register" element={<DriverRegister />} />
            <Route path="/customer-register" element={<CustomerRegister />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/video-feed" element={<VideoFeed />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
