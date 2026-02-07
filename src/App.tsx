import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import RoommateFinderPage from "./pages/RoommateFinderPage";
import HousingMapPage from "./pages/HousingMapPage";
import LeaseCheckerPage from "./pages/LeaseCheckerPage";
import HousingAdvisorPage from "./pages/HousingAdvisorPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import MyListingsPage from "./pages/MyListingsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import StudentHousingGuide from "./pages/StudentHousingGuidePage";
import RoommateTips from "./pages/RoomMateTips";
import LeaseFAQ from "./pages/LeaseFAQ";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />

            {/* Public resource pages */}
            <Route
              path="/resources/student-housing-guide"
              element={<StudentHousingGuide />}
            />
            <Route path="/resources/roommate-tips" element={<RoommateTips />} />
            <Route path="/resources/lease-faq" element={<LeaseFAQ />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roommate-finder"
              element={
                <ProtectedRoute allowedRole="student">
                  <RoommateFinderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/housing-map"
              element={
                <ProtectedRoute>
                  <HousingMapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lease-checker"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <LeaseCheckerPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-listings"
              element={
                <ProtectedRoute allowedRole="landlord">
                  <MyListingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/housing-advisor"
              element={
                <ProtectedRoute>
                  <HousingAdvisorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
