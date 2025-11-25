import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/context/AuthContext"
import Home from "./pages/Home"
import CitizenLogin from "./pages/CitizenLogin"
import CitizenRegister from "./pages/CitizenRegister"
import CitizenDashboard from "./pages/CitizenDashboard"
import BinMap from "./pages/BinMap"
import Education from "./pages/Education"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/admin/Dashboard"
import AdminBins from "./pages/admin/Bins"
import AdminRoutes from "./pages/admin/Routes"
import AdminCollectors from "./pages/admin/Collectors"
import AdminComplaints from "./pages/admin/Complaints"
import AdminIoTData from "./pages/admin/IoTData"
import NotFound from "./pages/NotFound"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/citizen-login" element={<CitizenLogin />} />
            <Route path="/citizen-register" element={<CitizenRegister />} />
            <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
            <Route path="/bin-map" element={<BinMap />} />
            <Route path="/education" element={<Education />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/bins" element={<AdminBins />} />
            <Route path="/admin/routes" element={<AdminRoutes />} />
            <Route path="/admin/collectors" element={<AdminCollectors />} />
            <Route path="/admin/complaints" element={<AdminComplaints />} />
            <Route path="/admin/iot-data" element={<AdminIoTData />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
)

export default App
