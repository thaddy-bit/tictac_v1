import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { ConfigProvider } from "@/lib/config-context";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Register from "./pages/Register.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import WalletPage from "./pages/WalletPage.tsx";
import PharmacyDashboard from "./pages/PharmacyDashboard.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import SupportPage from "./pages/SupportPage.tsx";
import SearchHistory from "./pages/SearchHistory.tsx";
import ResultPage from "./pages/ResultPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ConfigProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<ProtectedRoute requiredRole="user"><SearchPage /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute requiredRole="user"><WalletPage /></ProtectedRoute>} />
            <Route path="/pharmacy" element={<ProtectedRoute requiredRole={['pharmacy', 'admin']}><PharmacyDashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute requiredRole={['user', 'admin']}><SearchHistory /></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
            <Route path="/result/:id" element={<ProtectedRoute requiredRole={['user', 'admin']}><ResultPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ConfigProvider>
  </AuthProvider>
  </QueryClientProvider>
);

export default App;
