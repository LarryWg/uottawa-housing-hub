import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import RoommateFinderPage from "./pages/RoommateFinderPage";
import HousingMapPage from "./pages/HousingMapPage";
import LeaseCheckerPage from "./pages/LeaseCheckerPage";
import MatchesPage from "./pages/MatchesPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

// ✅ NEW resource pages (adjust paths if your files are elsewhere)
import StudentHousingGuide from "./pages/resources/StudentHousingGuide";
import RoommateTips from "./pages/resources/RoommateTips";
import LeaseFAQ from "./pages/resources/LeaseFAQ";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />

            <Route path="/roommate-finder" element={<RoommateFinderPage />} />
            <Route path="/housing-map" element={<HousingMapPage />} />
            <Route path="/lease-checker" element={<LeaseCheckerPage />} />
            <Route path="/matches" element={<MatchesPage />} />

            {/* ✅ NEW resource routes */}
            <Route
              path="/resources/student-housing-guide"
              element={<StudentHousingGuide />}
            />
            <Route path="/resources/roommate-tips" element={<RoommateTips />} />
            <Route path="/resources/lease-faq" element={<LeaseFAQ />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
