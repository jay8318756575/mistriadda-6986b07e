
import InstallPrompt from '@/components/InstallPrompt';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import ElectricianService from "./pages/ElectricianService";
import PlumberService from "./pages/PlumberService";
import CarpenterService from "./pages/CarpenterService";
import PainterService from "./pages/PainterService";
import MasonService from "./pages/MasonService";
import MechanicService from "./pages/MechanicService";
import WelderService from "./pages/WelderService";
import GardenerService from "./pages/GardenerService";
import CleanerService from "./pages/CleanerService";
import DriverService from "./pages/DriverService";
import SecurityService from "./pages/SecurityService";
import CookService from "./pages/CookService";
import PropertyService from "./pages/PropertyService";
import KabadiService from "./pages/KabadiService";
import PopCeilingService from "./pages/PopCeilingService";
import GypsumBoardService from "./pages/GypsumBoardService";
import JunctionSealingService from "./pages/JunctionSealingService";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import Videos from "./pages/Videos";
import VideoFeed from "./pages/VideoFeed";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import DriverRegister from "./pages/DriverRegister";
import CustomerRegister from "./pages/CustomerRegister";
import Download from "./pages/Download";
import PrivacyPolicy from "./pages/PrivacyPolicy";
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
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/electrician-service" element={<ElectricianService />} />
            <Route path="/plumber-service" element={<PlumberService />} />
            <Route path="/carpenter-service" element={<CarpenterService />} />
            <Route path="/painter-service" element={<PainterService />} />
            <Route path="/mason-service" element={<MasonService />} />
            <Route path="/mechanic-service" element={<MechanicService />} />
            <Route path="/welder-service" element={<WelderService />} />
            <Route path="/gardener-service" element={<GardenerService />} />
            <Route path="/cleaner-service" element={<CleanerService />} />
            <Route path="/driver-service" element={<DriverService />} />
            <Route path="/security-service" element={<SecurityService />} />
            <Route path="/cook-service" element={<CookService />} />
            <Route path="/property-service" element={<PropertyService />} />
            <Route path="/kabadi-service" element={<KabadiService />} />
            <Route path="/pop-ceiling-service" element={<PopCeilingService />} />
            <Route path="/gypsum-board-service" element={<GypsumBoardService />} />
            <Route path="/junction-sealing-service" element={<JunctionSealingService />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/video-feed" element={<VideoFeed />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/driver-register" element={<DriverRegister />} />
            <Route path="/customer-register" element={<CustomerRegister />} />
            <Route path="/download" element={<Download />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <InstallPrompt />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
