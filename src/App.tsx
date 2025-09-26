import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import WorkstationManagement from "./pages/WorkstationManagement";
import ProtocolManagement from "./pages/ProtocolManagement";
import AgingProcessManagement from "./pages/AgingProcessManagement";
import Analytics from "./pages/Analytics";
import SystemManagement from "./pages/SystemManagement";
import NotFound from "./pages/NotFound";
import Navbar from "@/components/ui/navbar";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Dashboard />
              </>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/workstations" 
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <WorkstationManagement />
              </>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/protocols" 
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <ProtocolManagement />
              </>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/aging-processes" 
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <AgingProcessManagement />
              </>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Analytics />
              </>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/system" 
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <SystemManagement />
              </>
            </ProtectedRoute>
          } 
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </QueryClientProvider>
);

export default App;