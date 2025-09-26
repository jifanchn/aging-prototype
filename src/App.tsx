import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import WorkstationManagement from "./pages/WorkstationManagement";
import ProtocolManagement from "./pages/ProtocolManagement";
import AgingProcessManagement from "./pages/AgingProcessManagement";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Navbar from "@/components/ui/navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workstations" element={<WorkstationManagement />} />
          <Route path="/protocols" element={<ProtocolManagement />} />
          <Route path="/aging-processes" element={<AgingProcessManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/system" element={<div className="p-6">系统管理页面</div>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;