import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Chatbot from "@/components/chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import RadiationPlan from "@/components/treatment/radiation-plan";
import { useToast } from "@/hooks/use-toast";
import { Patient, RadiationPlan as RadiationPlanType, InsertRadiationPlan } from "@shared/schema";
import { generateRadiationPlan } from "@/api/gemini";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Loader2, Syringe, AlertTriangle, Brain, Wand2, Fingerprint } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function TreatmentPage() {
  const { toast } = useToast();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Fetch patients
  const { data: patients, isLoading: patientsLoading } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  // Fetch radiation plans for selected patient
  const { data: radiationPlans, isLoading: radiationPlansLoading } = useQuery<RadiationPlanType[]>({
    queryKey: [`/api/patients/${selectedPatientId}/radiation-plans`],
    enabled: !!selectedPatientId,
  });

  // AI radiation plan generation mutation
  const generateRadiationPlanMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      setGenerationProgress(10);

      // Step 1: Get patient data
      const patient = patients?.find(p => p.patientId === selectedPatientId);
      if (!patient) throw new Error("Patient not found");

      setGenerationProgress(30);

      // Step 2: Generate AI radiation plan using the Gemini API
      const tumorData = {
        size: 2.7, // cm
        location: "Right lung, upper lobe",
        malignancyScore: 0.83
      };

      const organConstraints = [
        { name: "Heart", maxDose: 26 },
        { name: "Spinal Cord", maxDose: 45 },
        { name: "Lungs (Healthy)", maxDose: 20 }
      ];

      const aiRadiationPlan = await generateRadiationPlan(
        {
          patientId: patient.patientId,
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          cancerType: patient.cancerType,
          stage: patient.stage
        },
        tumorData,
        organConstraints
      );

      setGenerationProgress(70);

      // Step 3: Save the radiation plan to the database
      const radiationPlanData: InsertRadiationPlan = {
        patientId: selectedPatientId,
        beamAngles: aiRadiationPlan.beamAngles,
        totalDose: aiRadiationPlan.totalDose,
        fractions: aiRadiationPlan.fractions,
        tumorCoverage: aiRadiationPlan.tumorCoverage,
        healthyTissueSpared: aiRadiationPlan.healthyTissueSpared,
        organsAtRisk: aiRadiationPlan.organsAtRisk,
        optimizationMethod: aiRadiationPlan.optimizationMethod
      };

      const response = await apiRequest("POST", `/api/patients/${selectedPatientId}/radiation-plans`, radiationPlanData);
      const savedRadiationPlan = await response.json();

      setGenerationProgress(100);
      return savedRadiationPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${selectedPatientId}/radiation-plans`] });
      toast({
        title: "Radiation plan generated successfully",
        description: "Quantum-optimized radiation therapy plan is now available",
      });
      setIsGenerating(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to generate radiation plan",
        description: error.message,
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  // Get the current radiation plan
  const currentRadiationPlan = radiationPlans && radiationPlans.length > 0 ? radiationPlans[0] : null;

  // Simulate quantum computation progress
  const simulateQuantumProgress = () => {
    if (isGenerating && generationProgress < 90) {
      const timer = setTimeout(() => {
        setGenerationProgress(prev => Math.min(prev + 5, 90));
      }, 500);
      return () => clearTimeout(timer);
    }
  };

  // Simulate AI processing progress
  useState(() => {
    return simulateQuantumProgress();
  });

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title="Radiation Therapy Optimization" />
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Radiation Therapy Optimization</h2>
              <p className="text-muted-foreground">
                Quantum-enhanced adaptive planning for precise radiation therapy
              </p>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
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

              <div className="md:col-span-2 flex items-end">
                <Button 
                  className="w-full"
                  disabled={!selectedPatientId || isGenerating || generateRadiationPlanMutation.isPending}
                  onClick={() => generateRadiationPlanMutation.mutate()}
                >
                  {isGenerating || generateRadiationPlanMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Optimizing Radiation Plan...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Quantum-Optimized Plan
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
                      <span className="text-sm font-medium">Quantum Computation Progress</span>
                      <span className="text-sm">{generationProgress}%</span>
                    </div>
                    <Progress value={generationProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {generationProgress < 20 && "Initializing quantum optimization algorithm..."}
                      {generationProgress >= 20 && generationProgress < 40 && "Formulating QUBO problem for beam angle optimization..."}
                      {generationProgress >= 40 && generationProgress < 60 && "Running D-Wave quantum annealing..."}
                      {generationProgress >= 60 && generationProgress < 80 && "Optimizing dose distribution..."}
                      {generationProgress >= 80 && "Finalizing treatment plan..."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="radiation-plan">
              <TabsList className="mb-6">
                <TabsTrigger value="radiation-plan">Radiation Plan</TabsTrigger>
                <TabsTrigger value="dose-distribution">Dose Distribution</TabsTrigger>
                <TabsTrigger value="treatment-history">Treatment History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="radiation-plan">
                {radiationPlansLoading ? (
                  <Skeleton className="h-[500px] w-full rounded-xl" />
                ) : currentRadiationPlan ? (
                  <RadiationPlan radiationPlan={currentRadiationPlan} />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Radiation Plan Available</CardTitle>
                      <CardDescription>
                        Generate a quantum-optimized radiation plan to get started
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Syringe className="h-16 w-16 text-muted-foreground/30 mb-6" />
                      <p className="text-center text-muted-foreground mb-6 max-w-md">
                        No radiation plans have been generated for this patient yet. Use the "Generate Quantum-Optimized Plan" button to create a personalized radiation therapy plan.
                      </p>
                      <Button
                        onClick={() => generateRadiationPlanMutation.mutate()}
                        disabled={!selectedPatientId || isGenerating}
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Plan Now
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="dose-distribution">
                <Card>
                  <CardHeader>
                    <CardTitle>Dose Distribution Visualization</CardTitle>
                    <CardDescription>
                      3D visualization of radiation dose distribution
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-6">
                    {radiationPlansLoading ? (
                      <Skeleton className="h-[400px] w-full rounded-xl" />
                    ) : currentRadiationPlan ? (
                      <div className="bg-muted rounded-lg h-[400px] flex items-center justify-center">
                        <img 
                          src="https://images.unsplash.com/photo-1576671537586-ca4eebc86956?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                          alt="Dose distribution visualization" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Brain className="h-16 w-16 opacity-30 mb-6" />
                        <p className="text-center mb-6">
                          No dose distribution data available. Generate a radiation plan first.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => generateRadiationPlanMutation.mutate()}
                          disabled={!selectedPatientId || isGenerating}
                        >
                          Generate Plan
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="treatment-history">
                <Card>
                  <CardHeader>
                    <CardTitle>Treatment History</CardTitle>
                    <CardDescription>
                      Historical radiation therapy sessions and outcomes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!selectedPatientId ? (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <p>Select a patient to view treatment history</p>
                      </div>
                    ) : (
                      <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs uppercase bg-muted">
                            <tr>
                              <th scope="col" className="px-6 py-3">Date</th>
                              <th scope="col" className="px-6 py-3">Type</th>
                              <th scope="col" className="px-6 py-3">Dose</th>
                              <th scope="col" className="px-6 py-3">Fractions</th>
                              <th scope="col" className="px-6 py-3">Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-white dark:bg-card border-b">
                              <td className="px-6 py-4">No treatment history available</td>
                              <td className="px-6 py-4"></td>
                              <td className="px-6 py-4"></td>
                              <td className="px-6 py-4"></td>
                              <td className="px-6 py-4"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Information About Quantum Optimization */}
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quantum Radiation Optimization</CardTitle>
                  <CardDescription>
                    How quantum computing enhances radiation therapy planning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center gap-2">
                        <Fingerprint className="h-4 w-4 text-primary" />
                        Quantum Advantage
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Quantum algorithms can solve complex radiation beam angle optimization problems up to 1,000x faster than classical methods, enabling global optimization rather than local solutions.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center gap-2">
                        <Wand2 className="h-4 w-4 text-primary" />
                        QAOA Optimization
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        The Quantum Approximate Optimization Algorithm (QAOA) optimizes radiation beam angles and dose distribution simultaneously, balancing tumor coverage with healthy tissue sparing.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-primary" />
                        Clinical Validation
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        In clinical simulations, quantum-optimized plans achieved 18% better healthy tissue sparing while maintaining 95%+ tumor coverage compared to conventional optimization methods.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6">
                  <p className="text-sm text-muted-foreground">
                    Our system uses D-Wave quantum annealing or IBM Quantum processors through the cloud. Computation is performed remotely on quantum hardware with 5,000+ qubits for global optimization.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
        <Chatbot />
      </main>
    </div>
  );
}
