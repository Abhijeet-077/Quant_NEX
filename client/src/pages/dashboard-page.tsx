import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Chatbot from "@/components/chatbot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Patient } from "@shared/schema";
import PatientCard from "@/components/patient/patient-card";
import TumorVisualization from "@/components/tumor-visualization";
import DiagnosisPanel from "@/components/diagnosis/diagnosis-panel";
import SurvivalChart from "@/components/prognosis/survival-chart";
import { useToast } from "@/hooks/use-toast";
import { LayoutDashboard, Users, Upload, Activity } from "lucide-react";

export default function DashboardPage() {
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Fetch patients
  const { data: patients, isLoading: patientsLoading, error: patientsError } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  // Select the first patient by default when patients are loaded
  useEffect(() => {
    if (patients && patients.length > 0 && !selectedPatient) {
      setSelectedPatient(patients[0]);
    }
  }, [patients, selectedPatient]);

  // Handle errors
  useEffect(() => {
    if (patientsError) {
      toast({
        title: "Error loading patients",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }, [patientsError, toast]);

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title="Patient Dashboard" />
        <div className="flex-1 overflow-y-auto">
          {/* Dashboard Overview Stats */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {patientsLoading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{patients?.length || 0}</p>
                )}
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Analysis</CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">4 scans waiting for AI processing</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Recent Diagnoses</CardTitle>
                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-muted-foreground">In the last 7 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground text-red-500">2 critical alerts</p>
              </CardContent>
            </Card>
          </div>

          {/* Patient Summary and Tumor Visualization */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 alternate-cols">
            {/* Patient Card */}
            {patientsLoading ? (
              <div className="lg:col-span-1">
                <Skeleton className="h-[350px] w-full rounded-xl" />
              </div>
            ) : patients && patients.length > 0 ? (
              <PatientCard
                patient={selectedPatient || patients[0]}
                onPatientChange={setSelectedPatient}
                patientsList={patients}
              />
            ) : (
              <Card className="lg:col-span-1">
                <CardContent className="p-6 flex flex-col items-center justify-center h-[350px]">
                  <p className="text-muted-foreground">No patients available</p>
                </CardContent>
              </Card>
            )}

            {/* Tumor Visualization */}
            {selectedPatient ? (
              <TumorVisualization patientId={selectedPatient.patientId} />
            ) : (
              <div className="lg:col-span-3">
                <Skeleton className="h-[350px] w-full rounded-xl" />
              </div>
            )}
          </div>

          {/* Diagnosis and Prognosis Tabs */}
          <div className="px-6 pb-6">
            <Tabs defaultValue="diagnosis">
              <TabsList>
                <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
                <TabsTrigger value="prognosis">Prognosis</TabsTrigger>
              </TabsList>
              <TabsContent value="diagnosis" className="pt-4">
                {selectedPatient ? (
                  <DiagnosisPanel patientId={selectedPatient.patientId} />
                ) : (
                  <Skeleton className="h-[250px] w-full rounded-xl" />
                )}
              </TabsContent>
              <TabsContent value="prognosis" className="pt-4">
                {selectedPatient ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Survival Probability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SurvivalChart patientId={selectedPatient.patientId} />
                    </CardContent>
                  </Card>
                ) : (
                  <Skeleton className="h-[250px] w-full rounded-xl" />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <Footer />
        <Chatbot />
      </main>
    </div>
  );
}
