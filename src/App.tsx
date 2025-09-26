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
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <>
                  <Navbar />
                  <Dashboard />
                </>
              } 
            />
            <Route 
              path="/workstations" 
              element={
                <>
                  <Navbar />
                  <WorkstationManagement />
                </>
              } 
            />
            <Route 
              path="/protocols" 
              element={
                <>
                  <Navbar />
                  <ProtocolManagement />
                </>
              } 
            />
            <Route 
              path="/aging-processes" 
              element={
                <>
                  <Navbar />
                  <AgingProcessManagement />
                </>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <>
                  <Navbar />
                  <Analytics />
                </>
              } 
            />
            <Route 
              path="/system" 
              element={
                <>
                  <Navbar />
                  <SystemManagement />
                </>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;