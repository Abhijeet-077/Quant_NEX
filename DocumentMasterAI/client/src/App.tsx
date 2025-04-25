import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import PatientsPage from "@/pages/patients-page";
import UploadPage from "@/pages/upload-page";
import DiagnosisPage from "@/pages/diagnosis-page";
import PrognosisPage from "@/pages/prognosis-page";
import TreatmentPage from "@/pages/treatment-page";
import MonitoringPage from "@/pages/monitoring-page";
import DocumentationPage from "@/pages/documentation-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected routes */}
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/patients" component={PatientsPage} />
      <ProtectedRoute path="/upload" component={UploadPage} />
      <ProtectedRoute path="/diagnosis" component={DiagnosisPage} />
      <ProtectedRoute path="/prognosis" component={PrognosisPage} />
      <ProtectedRoute path="/treatment" component={TreatmentPage} />
      <ProtectedRoute path="/monitoring" component={MonitoringPage} />
      <ProtectedRoute path="/documentation" component={DocumentationPage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
