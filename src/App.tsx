import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Priority from "./pages/Priority";
import Learn from "./pages/Learn";
import Food from "./pages/Food";
import Company from "./pages/Company";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Redirect authenticated users away from login page
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route
      path="/login"
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />

    {/* Protected routes */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/priority"
      element={
        <ProtectedRoute>
          <Priority />
        </ProtectedRoute>
      }
    />
    <Route
      path="/learn"
      element={
        <ProtectedRoute>
          <Learn />
        </ProtectedRoute>
      }
    />
    <Route
      path="/food"
      element={
        <ProtectedRoute>
          <Food />
        </ProtectedRoute>
      }
    />
    <Route
      path="/company"
      element={
        <ProtectedRoute>
          <Company />
        </ProtectedRoute>
      }
    />

    {/* Redirect root to dashboard */}
    <Route path="/" element={<Navigate to="/dashboard" replace />} />

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
