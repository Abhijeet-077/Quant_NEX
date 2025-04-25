import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Chatbot from "@/components/chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import BiomarkerChart from "@/components/monitoring/biomarker-chart";
import TumorTracking from "@/components/monitoring/tumor-tracking";
import AlertPanel from "@/components/monitoring/alert-panel";
import { useToast } from "@/hooks/use-toast";
import { Patient, Biomarker, Alert, InsertBiomarker, InsertAlert } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Loader2, 
  Bell, 
  Activity, 
  LineChart, 
  Calendar, 
  PlusCircle,
  Check,
  RefreshCw,
} from "@/lib/icons";
import { Badge } from "@/components/ui/badge";

export default function MonitoringPage() {
  const { toast } = useToast();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("30-days");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  // Fetch patients
  const { data: patients, isLoading: patientsLoading } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  // Fetch biomarkers for selected patient
  const { 
    data: biomarkers, 
    isLoading: biomarkersLoading,
    refetch: refetchBiomarkers 
  } = useQuery<Biomarker[]>({
    queryKey: [`/api/patients/${selectedPatientId}/biomarkers`],
    enabled: !!selectedPatientId,
  });

  // Fetch alerts for selected patient
  const { 
    data: alerts, 
    isLoading: alertsLoading,
    refetch: refetchAlerts
  } = useQuery<Alert[]>({
    queryKey: [`/api/patients/${selectedPatientId}/alerts`],
    enabled: !!selectedPatientId,
  });

  // Select the first patient by default when patients are loaded
  useEffect(() => {
    if (patients && patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].patientId);
    }
  }, [patients, selectedPatientId]);

  // Set up auto-refresh interval
  useEffect(() => {
    if (autoRefresh) {
      const interval = window.setInterval(() => {
        if (selectedPatientId) {
          refetchBiomarkers();
          refetchAlerts();
          toast({
            title: "Data refreshed",
            description: "Patient monitoring data has been updated",
          });
        }
      }, 60000); // Refresh every minute
      setRefreshInterval(interval);
    } else {
      if (refreshInterval) {
        window.clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }

    return () => {
      if (refreshInterval) {
        window.clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh, selectedPatientId, refetchBiomarkers, refetchAlerts, refreshInterval, toast]);

  // Acknowledge alert mutation
  const acknowledgeAlertMutation = useMutation({
    mutationFn: async (alertId: number) => {
      const response = await apiRequest("PATCH", `/api/alerts/${alertId}/acknowledge`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${selectedPatientId}/alerts`] });
      toast({
        title: "Alert acknowledged",
        description: "The alert has been marked as acknowledged",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to acknowledge alert",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create mock biomarker (this would be done by actual sensors/measurements in real life)
  const createBiomarkerMutation = useMutation({
    mutationFn: async (biomarker: InsertBiomarker) => {
      const response = await apiRequest("POST", `/api/patients/${selectedPatientId}/biomarkers`, biomarker);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${selectedPatientId}/biomarkers`] });
      toast({
        title: "Biomarker added",
        description: "New biomarker reading has been recorded",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add biomarker",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle manual refresh
  const handleRefresh = () => {
    if (selectedPatientId) {
      refetchBiomarkers();
      refetchAlerts();
      toast({
        title: "Data refreshed",
        description: "Patient monitoring data has been updated",
      });
    }
  };

  // Get the selected patient
  const selectedPatient = patients?.find(p => p.patientId === selectedPatientId);

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title="Patient Monitoring" />
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Patient Monitoring</h2>
              <p className="text-muted-foreground">
                Real-time metrics and alerts for patient health tracking
              </p>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <label className="text-sm font-medium mb-2 block">Select Patient</label>
                <Select
                  value={selectedPatientId}
                  onValueChange={setSelectedPatientId}
                  disabled={patientsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patientsLoading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading patients...
                      </div>
                    ) : patients && patients.length > 0 ? (
                      patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.patientId}>
                          {patient.name} ({patient.patientId}) - {patient.cancerType}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="flex items-center justify-center p-2 text-muted-foreground">
                        No patients available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Timeframe</label>
                <Select
                  value={selectedTimeframe}
                  onValueChange={setSelectedTimeframe}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30-days">30 Days</SelectItem>
                    <SelectItem value="90-days">90 Days</SelectItem>
                    <SelectItem value="all-time">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="auto-refresh" 
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                  />
                  <Label htmlFor="auto-refresh">Auto-refresh data</Label>
                </div>
              </div>

              <div className="flex items-end">
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Data
                </Button>
              </div>
            </div>

            {selectedPatientId && selectedPatient && (
              <div className="mb-6 flex items-center justify-between bg-muted/50 border rounded-lg p-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedPatient.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedPatient.cancerType}, {selectedPatient.stage}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={selectedPatient.status === "active" ? "default" : 
                        selectedPatient.status === "remission" ? "success" : 
                        selectedPatient.status === "critical" ? "destructive" : 
                        "secondary"}>
                    {selectedPatient.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    {alerts ? alerts.filter(a => !a.acknowledged).length : 0} Alerts
                  </Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Tumor Size Tracking */}
              <div>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Tumor Size Tracking</CardTitle>
                        <CardDescription>
                          Monitoring changes in tumor dimensions
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={selectedTimeframe === "30-days" ? "default" : "outline"} 
                               className="cursor-pointer"
                               onClick={() => setSelectedTimeframe("30-days")}>
                          30 Days
                        </Badge>
                        <Badge variant={selectedTimeframe === "90-days" ? "default" : "outline"} 
                               className="cursor-pointer"
                               onClick={() => setSelectedTimeframe("90-days")}>
                          90 Days
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {biomarkersLoading ? (
                      <Skeleton className="h-48 w-full" />
                    ) : (
                      <TumorTracking 
                        patientId={selectedPatientId} 
                        timeframe={selectedTimeframe}
                      />
                    )}
                  
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="bg-muted rounded-lg p-2 text-center">
                        <p className="text-xs text-muted-foreground">Initial</p>
                        <p className="text-sm font-bold">3.2 cm</p>
                      </div>
                      <div className="bg-muted rounded-lg p-2 text-center">
                        <p className="text-xs text-muted-foreground">Current</p>
                        <p className="text-sm font-bold text-green-600">2.7 cm</p>
                      </div>
                      <div className="bg-muted rounded-lg p-2 text-center">
                        <p className="text-xs text-muted-foreground">Change</p>
                        <p className="text-sm font-bold text-green-600">-15.6%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
                
              {/* Biomarkers */}
              <div>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Key Biomarkers</CardTitle>
                        <CardDescription>
                          Monitoring critical biomarker values
                        </CardDescription>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => {
                        if (!selectedPatientId) return;
                        const biomarkerTypes = ["CEA", "WBC", "CRP"];
                        const randomType = biomarkerTypes[Math.floor(Math.random() * biomarkerTypes.length)];
                        const randomValue = Math.random() * 10 + 1; // 1-11 range
                        
                        let normalLow = 0;
                        let normalHigh = 10;
                        let unit = "ng/mL";
                        
                        if (randomType === "CEA") {
                          normalLow = 0;
                          normalHigh = 5;
                          unit = "ng/mL";
                        } else if (randomType === "WBC") {
                          normalLow = 4.5;
                          normalHigh = 11;
                          unit = "K/µL";
                        } else if (randomType === "CRP") {
                          normalLow = 0;
                          normalHigh = 3;
                          unit = "mg/L";
                        }
                        
                        const newBiomarker: InsertBiomarker = {
                          patientId: selectedPatientId,
                          type: randomType,
                          value: randomValue,
                          unit,
                          normalRangeLow: normalLow,
                          normalRangeHigh: normalHigh,
                          trend: randomValue > normalHigh ? "up" : randomValue < normalLow ? "down" : "stable"
                        };
                        
                        createBiomarkerMutation.mutate(newBiomarker);
                      }}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Reading
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {biomarkersLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ) : biomarkers && biomarkers.length > 0 ? (
                      <BiomarkerChart 
                        biomarkers={biomarkers}
                        timeframe={selectedTimeframe}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <LineChart className="h-12 w-12 opacity-30 mb-4" />
                        <p className="mb-4">No biomarker data available</p>
                        <Button variant="outline" size="sm" disabled={!selectedPatientId} onClick={() => {
                          if (!selectedPatientId) return;
                          
                          // Create initial set of biomarkers
                          const biomarkerTypes = ["CEA", "WBC", "CRP"];
                          for (const type of biomarkerTypes) {
                            let value = 0;
                            let normalLow = 0;
                            let normalHigh = 10;
                            let unit = "ng/mL";
                            
                            if (type === "CEA") {
                              value = 4.2;
                              normalLow = 0;
                              normalHigh = 5;
                              unit = "ng/mL";
                            } else if (type === "WBC") {
                              value = 3.8;
                              normalLow = 4.5;
                              normalHigh = 11;
                              unit = "K/µL";
                            } else if (type === "CRP") {
                              value = 8.2;
                              normalLow = 0;
                              normalHigh = 3;
                              unit = "mg/L";
                            }
                            
                            const newBiomarker: InsertBiomarker = {
                              patientId: selectedPatientId,
                              type,
                              value,
                              unit,
                              normalRangeLow: normalLow,
                              normalRangeHigh: normalHigh,
                              trend: value > normalHigh ? "up" : value < normalLow ? "down" : "stable"
                            };
                            
                            createBiomarkerMutation.mutate(newBiomarker);
                          }
                        }}>
                          Generate Sample Data
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Alerts Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Alerts</CardTitle>
                    <CardDescription>
                      Health alerts requiring attention
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    {alerts ? alerts.filter(a => !a.acknowledged).length : 0} Unacknowledged
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {alertsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : alerts && alerts.length > 0 ? (
                  <AlertPanel 
                    alerts={alerts} 
                    onAcknowledge={(alertId) => acknowledgeAlertMutation.mutate(alertId)}
                    isAcknowledging={acknowledgeAlertMutation.isPending}
                  />
                ) : (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                      <Bell className="h-12 w-12 opacity-30 mb-4" />
                      <p className="mb-2">No alerts found</p>
                      <p className="text-sm">All patient parameters are within normal ranges</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Monitoring Configuration Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Monitoring Configuration</CardTitle>
                <CardDescription>
                  Configure alert thresholds and monitoring settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      Alert Thresholds
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span>Tumor Growth</span>
                        <span>{">"} 5% in 30 days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>CEA Level</span>
                        <span>{">"} 5.0 ng/mL</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>WBC Count</span>
                        <span>{"<"} 3.5 K/µL</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>C-Reactive Protein</span>
                        <span>{">"} 3.0 mg/L</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Monitoring Schedule
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span>Imaging (CT/MRI)</span>
                        <span>Every 3 months</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Blood Tests</span>
                        <span>Monthly</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Physical Exam</span>
                        <span>Every 2 months</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Patient Check-in</span>
                        <span>Weekly</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      Next Steps
                    </h3>
                    {selectedPatient ? (
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-1.5 rounded-full mr-2">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Next CT Scan</p>
                            <p className="text-muted-foreground">Scheduled for June 15, 2023</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-1.5 rounded-full mr-2">
                            <Activity className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Blood Work Due</p>
                            <p className="text-muted-foreground">In 7 days</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="bg-primary/10 p-1.5 rounded-full mr-2">
                            <Check className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Treatment Review</p>
                            <p className="text-muted-foreground">After next scan results</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Select a patient to view next steps</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
        <Chatbot />
      </main>
    </div>
  );
}
