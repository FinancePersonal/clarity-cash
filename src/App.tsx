import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { OnboardingModal } from "@/components/OnboardingModal";
import { userService } from "@/lib/user.service";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import Planning from "./pages/Planning";
import History from "./pages/History";
import Investments from "./pages/Investments";
import Admin from "./pages/Admin";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!token) {
        setCheckingProfile(false);
        return;
      }

      // Verifica se já completou onboarding
      const onboardingCompleted = localStorage.getItem('onboardingCompleted');
      if (onboardingCompleted === 'true') {
        setCheckingProfile(false);
        return;
      }

      try {
        const profile = await userService.getProfile();
        const needsOnboarding = !profile.salary || profile.salary === 0;
        setShowOnboarding(needsOnboarding);
      } catch (err) {
        console.error('Error checking profile:', err);
      } finally {
        setCheckingProfile(false);
      }
    };

    checkProfile();
  }, [token]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setShowOnboarding(false);
  };

  if (!token) return <Navigate to="/auth" />;
  if (checkingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <OnboardingModal open={showOnboarding} onComplete={handleOnboardingComplete} />
      {children}
    </>
  );
};

const App = () => {
  const token = localStorage.getItem('token');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/landing" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/app/*" element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/investments" element={<Investments />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/planning" element={<Planning />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/admin" element={<Admin />} />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/" element={token ? <Navigate to="/app" /> : <Landing />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
