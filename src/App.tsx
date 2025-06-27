import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Learning from "./pages/Learning";
import Courses from './pages/Courses';
import StudyMaterial from './pages/StudyMaterial';
import MaterialViewer from './pages/MaterialViewer';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/studymaterial" element={<StudyMaterial />} />
            <Route path="/studymaterial/:id" element={<MaterialViewer />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
