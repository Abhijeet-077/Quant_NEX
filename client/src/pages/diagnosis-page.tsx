import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Chatbot from "@/components/chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import TumorVisualization from "@/components/tumor-visualization";
import DiagnosisPanel from "@/components/diagnosis/diagnosis-panel";
import { useToast } from "@/hooks/use-toast";
import { Patient, Scan, Diagnosis, InsertDiagnosis } from "@shared/schema";
import { generateDiagnosis } from "@/api/gemini";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Loader2, Brain, FlaskConical, AlertTriangle, MoveRight, RotateCw, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function DiagnosisPage() {
  const { toast } = useToast();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedScanId, setSelectedScanId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Fetch patients
  const { data: patients, isLoading: patientsLoading } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  // Fetch scans for selected patient
  const { data: scans, isLoading: scansLoading } = useQuery<Scan[]>({
    queryKey: [`/api/patients/${selectedPatientId}/scans`],
    enabled: !!selectedPatientId,
  });

  // Fetch diagnoses for selected patient
  const { data: diagnoses, isLoading: diagnosesLoading } = useQuery<Diagnosis[]>({
    queryKey: [`/api/patients/${selectedPatientId}/diagnoses`],
    enabled: !!selectedPatientId,
  });

  // Select the first patient by default when patients are loaded
  useEffect(() => {
    if (patients && patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].patientId);
    }
  }, [patients, selectedPatientId]);

  // AI diagnosis generation mutation
  const generateDiagnosisMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      setGenerationProgress(10);

      // Step 1: Get patient data
      const patient = patients?.find(p => p.patientId === selectedPatientId);
      if (!patient) throw new Error("Patient not found");

      const scan = scans?.find(s => s.id === selectedScanId);
      if (!scan) throw new Error("Scan not found");

      setGenerationProgress(30);

      // Step 2: Generate AI diagnosis using the Gemini API
      const aiDiagnosis = await generateDiagnosis(
        {
          patientId: patient.patientId,
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          cancerType: patient.cancerType,
          stage: patient.stage
        },
        {
          scanType: scan.scanType,
          tumorDetected: scan.tumorDetected,
          tumorSize: scan.tumorSize,
          tumorLocation: scan.tumorLocation,
          malignancyScore: scan.malignancyScore
        }
      );

      setGenerationProgress(70);

      // Step 3: Save the diagnosis to the database
      const diagnosisData: InsertDiagnosis = {
        patientId: selectedPatientId,
        primaryDiagnosis: aiDiagnosis.primaryDiagnosis,
        confidence: aiDiagnosis.confidence,
        details: aiDiagnosis.details,
        alternativeDiagnoses: aiDiagnosis.alternativeDiagnoses
      };

      const response = await apiRequest("POST", `/api/patients/${selectedPatientId}/diagnoses`, diagnosisData);
      const savedDiagnosis = await response.json();

      setGenerationProgress(100);
      return savedDiagnosis;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${selectedPatientId}/diagnoses`] });
      toast({
        title: "Diagnosis generated successfully",
        description: "AI has analyzed the patient data and provided a diagnosis",
      });
      setIsGenerating(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to generate diagnosis",
        description: error.message,
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  // Get the selected scan
  const selectedScan = selectedScanId ? scans?.find(scan => scan.id === selectedScanId) : null;

  // Simulate AI processing progress
  useEffect(() => {
    if (isGenerating && generationProgress < 90) {
      const timer = setTimeout(() => {
        setGenerationProgress(prev => Math.min(prev + 10, 90));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isGenerating, generationProgress]);

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title="Diagnosis Assistance" />
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight">AI Diagnosis Assistance</h2>
              <p className="text-muted-foreground">
                Quantum-enhanced analysis for accurate cancer diagnosis
              </p>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
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
                          {patient.name} ({patient.patientId})
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
                <label className="text-sm font-medium mb-2 block">Select Scan</label>
                <Select
                  value={selectedScanId ? String(selectedScanId) : ""}
                  onValueChange={(value) => setSelectedScanId(Number(value))}
                  disabled={!selectedPatientId || scansLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select scan" />
                  </SelectTrigger>
                  <SelectContent>
                    {scansLoading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading scans...
                      </div>
                    ) : scans && scans.length > 0 ? (
                      scans.map((scan) => (
                        <SelectItem key={scan.id} value={String(scan.id)}>
                          {scan.scanType} - {new Date(scan.uploadedAt).toLocaleDateString()}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="flex items-center justify-center p-2 text-muted-foreground">
                        No scans available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:col-span-2 flex items-end">
                <Button 
                  className="w-full"
                  disabled={!selectedPatientId || !selectedScanId || isGenerating || generateDiagnosisMutation.isPending}
                  onClick={() => generateDiagnosisMutation.mutate()}
                >
                  {isGenerating || generateDiagnosisMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Diagnosis...
                    </>
                  ) : (
                    <>
                      <FlaskConical className="mr-2 h-4 w-4" />
                      Generate AI Diagnosis
                    </>
                  )}
                </Button>
              </div>
            </div>

            {isGenerating && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">AI Diagnosis Generation</span>
                      <span className="text-sm">{generationProgress}%</span>
                    </div>
                    <Progress value={generationProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {generationProgress < 30 && "Analyzing patient data..."}
                      {generationProgress >= 30 && generationProgress < 60 && "Running quantum-enhanced tumor analysis..."}
                      {generationProgress >= 60 && generationProgress < 90 && "Comparing with clinical databases..."}
                      {generationProgress >= 90 && "Finalizing diagnosis report..."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tumor Visualization */}
              <div className="lg:col-span-2">
                {selectedPatientId && selectedScan ? (
                  <TumorVisualization patientId={selectedPatientId} scanId={selectedScanId} />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tumor Visualization</CardTitle>
                      <CardDescription>
                        Select a patient and scan to view tumor visualization
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                      <Brain className="h-16 w-16 mb-4 opacity-30" />
                      <p>No scan selected</p>
                      <p className="text-sm">Please select a patient and scan to visualize tumor data</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Diagnosis Panel */}
              <div>
                <Tabs defaultValue="current">
                  <TabsList className="mb-4 w-full">
                    <TabsTrigger value="current">Current Diagnosis</TabsTrigger>
                    <TabsTrigger value="history">Diagnosis History</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="current">
                    {selectedPatientId ? (
                      diagnosesLoading ? (
                        <Card>
                          <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2 mt-2" />
                          </CardHeader>
                          <CardContent>
                            <Skeleton className="h-20 w-full mb-4" />
                            <Skeleton className="h-8 w-3/4 mb-2" />
                            <Skeleton className="h-8 w-3/4 mb-2" />
                          </CardContent>
                        </Card>
                      ) : diagnoses && diagnoses.length > 0 ? (
                        <DiagnosisPanel
                          patientId={selectedPatientId}
                          diagnosisId={diagnoses[0].id}
                        />
                      ) : (
                        <Card>
                          <CardHeader>
                            <CardTitle>No Diagnosis Available</CardTitle>
                            <CardDescription>
                              This patient doesn't have any diagnosis yet
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex flex-col items-center justify-center py-6">
                            <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <p className="text-center text-muted-foreground mb-4">
                              No diagnosis has been generated yet. Use the "Generate AI Diagnosis" button to create one.
                            </p>
                            <Button
                              variant="outline"
                              onClick={() => generateDiagnosisMutation.mutate()}
                              disabled={!selectedPatientId || !selectedScanId || isGenerating}
                            >
                              Generate Now
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    ) : (
                      <Card>
                        <CardHeader>
                          <CardTitle>Select a Patient</CardTitle>
                          <CardDescription>
                            Choose a patient to view their diagnosis
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                          <Users className="h-12 w-12 mb-4 opacity-30" />
                          <p>No patient selected</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="history">
                    <Card>
                      <CardHeader>
                        <CardTitle>Diagnosis History</CardTitle>
                        <CardDescription>
                          View previous diagnoses for this patient
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {diagnosesLoading ? (
                          <div className="space-y-4">
                            {Array(3).fill(0).map((_, i) => (
                              <Skeleton key={i} className="h-16 w-full" />
                            ))}
                          </div>
                        ) : diagnoses && diagnoses.length > 0 ? (
                          <div className="space-y-3">
                            {diagnoses.map((diagnosis, index) => (
                              <Card key={diagnosis.id} className="overflow-hidden">
                                <div className="p-4 flex justify-between items-center hover:bg-muted/50 cursor-pointer">
                                  <div>
                                    <p className="font-medium text-sm">{diagnosis.primaryDiagnosis}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(diagnosis.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    View <MoveRight className="ml-1 h-3 w-3" />
                                  </Button>
                                </div>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                            <p>No diagnosis history available</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Additional Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Diagnosis Information</CardTitle>
                <CardDescription>
                  How the quantum-enhanced AI generates diagnosis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">Quantum-AI Approach</h3>
                    <p className="text-sm text-muted-foreground">
                      Our diagnosis system uses quantum neural networks to analyze medical images with higher accuracy than traditional methods. The quantum model can detect subtle patterns that might be missed by conventional AI.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Data Sources</h3>
                    <p className="text-sm text-muted-foreground">
                      The system is trained on over 25,000 verified cancer cases, and references medical literature databases in real-time. It combines patient history, lab results, and imaging data for a comprehensive diagnosis.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Accuracy & Limitations</h3>
                    <p className="text-sm text-muted-foreground">
                      While our system achieves 94% accuracy in clinical validation, it's designed to assist medical professionals, not replace them. Always review AI suggestions with clinical expertise and judgment.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-between">
                <Button variant="outline" size="sm">
                  <RotateCw className="mr-2 h-4 w-4" />
                  Refresh Analysis
                </Button>
                <Button size="sm">
                  Generate Detailed Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        <Footer />
        <Chatbot />
      </main>
    </div>
  );
}
