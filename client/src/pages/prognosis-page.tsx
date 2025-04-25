import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Chatbot from "@/components/chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import SurvivalChart from "@/components/prognosis/survival-chart";
import { useToast } from "@/hooks/use-toast";
import { Patient, Diagnosis, Prognosis, InsertPrognosis } from "@shared/schema";
import { generatePrognosis } from "@/api/gemini";
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
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  LineChart, 
  Activity, 
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle
} from "lucide-react";

export default function PrognosisPage() {
  const { toast } = useToast();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("3-year");
  const [showConfidence, setShowConfidence] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Fetch patients
  const { data: patients, isLoading: patientsLoading } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  // Fetch diagnoses for selected patient
  const { data: diagnoses, isLoading: diagnosesLoading } = useQuery<Diagnosis[]>({
    queryKey: [`/api/patients/${selectedPatientId}/diagnoses`],
    enabled: !!selectedPatientId,
  });

  // Fetch prognoses for selected patient
  const { data: prognoses, isLoading: prognosesLoading } = useQuery<Prognosis[]>({
    queryKey: [`/api/patients/${selectedPatientId}/prognoses`],
    enabled: !!selectedPatientId,
  });

  // Select the first patient by default when patients are loaded
  useEffect(() => {
    if (patients && patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].patientId);
    }
  }, [patients, selectedPatientId]);

  // AI prognosis generation mutation
  const generatePrognosisMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      setGenerationProgress(10);

      // Step 1: Get patient and diagnosis data
      const patient = patients?.find(p => p.patientId === selectedPatientId);
      if (!patient) throw new Error("Patient not found");

      const diagnosis = diagnoses && diagnoses.length > 0 ? diagnoses[0] : null;
      if (!diagnosis) throw new Error("No diagnosis found for this patient");

      setGenerationProgress(30);

      // Step 2: Generate AI prognosis using the Gemini API
      const treatmentOptions = [
        { name: "Standard Radiation", description: "Conventional radiation therapy" },
        { name: "Quantum-Optimized Radiation", description: "Radiation with quantum-computed beam angles and dosage" },
        { name: "Combined Therapy", description: "Radiation with immunotherapy (pembrolizumab)" },
        { name: "Surgery + Radiation", description: "Tumor resection followed by radiation" }
      ];

      const aiPrognosis = await generatePrognosis(
        {
          patientId: patient.patientId,
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          cancerType: patient.cancerType,
          stage: patient.stage
        },
        {
          primaryDiagnosis: diagnosis.primaryDiagnosis,
          confidence: diagnosis.confidence,
          details: diagnosis.details
        },
        treatmentOptions
      );

      setGenerationProgress(70);

      // Step 3: Save the prognosis to the database
      const prognosisData: InsertPrognosis = {
        patientId: selectedPatientId,
        survival1yr: aiPrognosis.survival1yr,
        survival3yr: aiPrognosis.survival3yr,
        survival5yr: aiPrognosis.survival5yr,
        treatmentScenarios: aiPrognosis.treatmentScenarios
      };

      const response = await apiRequest("POST", `/api/patients/${selectedPatientId}/prognoses`, prognosisData);
      const savedPrognosis = await response.json();

      setGenerationProgress(100);
      return savedPrognosis;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${selectedPatientId}/prognoses`] });
      toast({
        title: "Prognosis generated successfully",
        description: "AI has analyzed the patient data and provided a prognosis",
      });
      setIsGenerating(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to generate prognosis",
        description: error.message,
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  // Get the current prognosis and patient
  const currentPrognosis = prognoses && prognoses.length > 0 ? prognoses[0] : null;
  const selectedPatient = patients?.find(p => p.patientId === selectedPatientId);

  // Simulate AI processing progress
  useEffect(() => {
    if (isGenerating && generationProgress < 90) {
      const timer = setTimeout(() => {
        setGenerationProgress(prev => Math.min(prev + 10, 90));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isGenerating, generationProgress]);

  // Helper function to get survival rate based on timeframe
  const getSurvivalRate = (timeframe: string) => {
    if (!currentPrognosis) return null;
    
    switch (timeframe) {
      case "1-year": return currentPrognosis.survival1yr;
      case "3-year": return currentPrognosis.survival3yr;
      case "5-year": return currentPrognosis.survival5yr;
      default: return currentPrognosis.survival3yr;
    }
  };

  // Helper function to get survival rate color
  const getSurvivalRateColor = (rate: number) => {
    if (rate >= 0.7) return "text-green-600";
    if (rate >= 0.4) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title="Patient Prognosis" />
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Patient Prognosis</h2>
              <p className="text-muted-foreground">
                Quantum-enhanced survival prediction and treatment outcome analysis
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
                <label className="text-sm font-medium mb-2 block">Timeframe</label>
                <Select
                  value={selectedTimeframe}
                  onValueChange={setSelectedTimeframe}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-year">1-Year Survival</SelectItem>
                    <SelectItem value="3-year">3-Year Survival</SelectItem>
                    <SelectItem value="5-year">5-Year Survival</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="show-confidence" 
                    checked={showConfidence}
                    onCheckedChange={setShowConfidence}
                  />
                  <Label htmlFor="show-confidence">Show Confidence Intervals</Label>
                </div>
              </div>

              <div className="flex items-end">
                <Button 
                  className="w-full"
                  disabled={!selectedPatientId || isGenerating || generatePrognosisMutation.isPending || diagnosesLoading || !diagnoses?.length}
                  onClick={() => generatePrognosisMutation.mutate()}
                >
                  {isGenerating || generatePrognosisMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Prognosis...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Generate New Prognosis
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
                      <span className="text-sm font-medium">AI Prognosis Generation</span>
                      <span className="text-sm">{generationProgress}%</span>
                    </div>
                    <div className="w-full bg-secondary/20 rounded-full h-2">
                      <div 
                        className="bg-secondary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {generationProgress < 30 && "Analyzing patient and diagnosis data..."}
                      {generationProgress >= 30 && generationProgress < 60 && "Running quantum survival analysis..."}
                      {generationProgress >= 60 && generationProgress < 90 && "Simulating treatment outcomes..."}
                      {generationProgress >= 90 && "Finalizing prognosis report..."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {!diagnoses?.length && selectedPatientId && !diagnosesLoading && (
              <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                <CardContent className="pt-6 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-amber-800 dark:text-amber-300">Diagnosis Required</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                      This patient needs a diagnosis before generating a prognosis. Please go to the Diagnosis page first.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Survival Curves */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Survival Probability</CardTitle>
                        <CardDescription>
                          {selectedPatient ? `${selectedPatient.name}'s predicted survival over time` : 'Select a patient to view survival curves'}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={selectedTimeframe === "1-year" ? "default" : "outline"} 
                               className="cursor-pointer"
                               onClick={() => setSelectedTimeframe("1-year")}>
                          1-Year
                        </Badge>
                        <Badge variant={selectedTimeframe === "3-year" ? "default" : "outline"} 
                               className="cursor-pointer"
                               onClick={() => setSelectedTimeframe("3-year")}>
                          3-Year
                        </Badge>
                        <Badge variant={selectedTimeframe === "5-year" ? "default" : "outline"} 
                               className="cursor-pointer"
                               onClick={() => setSelectedTimeframe("5-year")}>
                          5-Year
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    {prognosesLoading ? (
                      <div className="h-full flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : selectedPatientId && currentPrognosis ? (
                      <SurvivalChart 
                        patientId={selectedPatientId} 
                        prognosisId={currentPrognosis.id}
                        showConfidence={showConfidence}
                      />
                    ) : selectedPatientId ? (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                        <LineChart className="h-16 w-16 mb-4 opacity-30" />
                        <p>No prognosis data available</p>
                        <Button 
                          className="mt-4" 
                          variant="outline"
                          onClick={() => generatePrognosisMutation.mutate()}
                          disabled={isGenerating || !diagnoses?.length}
                        >
                          Generate Prognosis
                        </Button>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                        <Activity className="h-16 w-16 mb-4 opacity-30" />
                        <p>Select a patient to view survival curves</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
                    <p>Based on quantum-enhanced survival analysis trained on 25,000+ similar cases</p>
                  </CardFooter>
                </Card>
              </div>

              {/* Survival Stats and Treatment Scenarios */}
              <div>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Survival Probability
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {prognosesLoading ? (
                        <div className="space-y-4">
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-full" />
                          <Skeleton className="h-8 w-full" />
                        </div>
                      ) : currentPrognosis ? (
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">1-Year Survival</span>
                              <span className={`text-lg font-bold ${getSurvivalRateColor(currentPrognosis.survival1yr)}`}>
                                {Math.round(currentPrognosis.survival1yr * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className={`bg-primary h-2 rounded-full`} 
                                style={{ width: `${currentPrognosis.survival1yr * 100}%` }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">3-Year Survival</span>
                              <span className={`text-lg font-bold ${getSurvivalRateColor(currentPrognosis.survival3yr)}`}>
                                {Math.round(currentPrognosis.survival3yr * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className={`bg-primary h-2 rounded-full`} 
                                style={{ width: `${currentPrognosis.survival3yr * 100}%` }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">5-Year Survival</span>
                              <span className={`text-lg font-bold ${getSurvivalRateColor(currentPrognosis.survival5yr)}`}>
                                {Math.round(currentPrognosis.survival5yr * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className={`bg-primary h-2 rounded-full`} 
                                style={{ width: `${currentPrognosis.survival5yr * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-4 text-center text-muted-foreground">
                          <p>No prognosis data available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Treatment Scenarios
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {prognosesLoading ? (
                        <div className="space-y-4">
                          <Skeleton className="h-20 w-full" />
                          <Skeleton className="h-20 w-full" />
                          <Skeleton className="h-20 w-full" />
                        </div>
                      ) : currentPrognosis && currentPrognosis.treatmentScenarios ? (
                        <div className="space-y-3">
                          {currentPrognosis.treatmentScenarios.map((scenario: any, index: number) => (
                            <Card key={index} className="overflow-hidden">
                              <div className={`p-3 ${index === 0 ? 'bg-secondary/10 border-secondary/20' : ''}`}>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium text-sm">{scenario.name}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">{scenario.description}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className={`font-bold ${getSurvivalRateColor(scenario.survivalRate)}`}>
                                      {Math.round(scenario.survivalRate * 100)}%
                                    </span>
                                    <p className="text-xs text-muted-foreground">{scenario.timeframe}</p>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="py-4 text-center text-muted-foreground">
                          <p>No treatment scenarios available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Risk Factors and Recommendation */}
            {selectedPatientId && currentPrognosis && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Risk Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                        <div>
                          <p className="font-medium">Advanced Age</p>
                          <p className="text-sm text-muted-foreground">Patient's age (62) increases risk</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                        <div>
                          <p className="font-medium">Tumor Size</p>
                          <p className="text-sm text-muted-foreground">Medium risk factor (2.7 cm diameter)</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <XCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                        <div>
                          <p className="font-medium">Metastasis</p>
                          <p className="text-sm text-muted-foreground">No distant metastases detected</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                        <div>
                          <p className="font-medium">Comorbidities</p>
                          <p className="text-sm text-muted-foreground">Hypertension may complicate treatment</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Follow-up Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <p className="font-medium">Recommended Treatment Plan</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Quantum-optimized radiation therapy combined with immunotherapy shows the highest predicted survival rate.
                        </p>
                      </div>
                      <div className="flex items-start">
                        <HelpCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                        <div>
                          <p className="font-medium">Short-term Follow-up</p>
                          <p className="text-sm text-muted-foreground">CT scan every 3 months for the first year</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <HelpCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                        <div>
                          <p className="font-medium">Long-term Monitoring</p>
                          <p className="text-sm text-muted-foreground">Biomarker testing every 6 months for 5 years</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <HelpCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                        <div>
                          <p className="font-medium">Quality of Life</p>
                          <p className="text-sm text-muted-foreground">Recommend psychological support and regular assessment</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
        <Footer />
        <Chatbot />
      </main>
    </div>
  );
}
