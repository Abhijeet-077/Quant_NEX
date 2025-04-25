import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Chatbot from "@/components/chatbot";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/hooks/use-toast";
import { apiUploadRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Patient } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Loader2, Check, AlertTriangle, Upload } from "lucide-react";

export default function UploadPage() {
  const { toast } = useToast();
  const [uploadType, setUploadType] = useState("medical-imaging");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [scanType, setScanType] = useState<string>("");
  const [options, setOptions] = useState({
    anonymize: true,
    processImmediately: true,
    notifyResults: true
  });

  // Fetch patients for dropdown
  const { data: patients, isLoading: patientsLoading } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const handleFileUpload = (file: File) => {
    setSelectedFile(file);
    setUploadComplete(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPatientId) {
      toast({
        title: "No patient selected",
        description: "Please select a patient",
        variant: "destructive",
      });
      return;
    }

    if (uploadType === "medical-imaging" && !scanType) {
      toast({
        title: "Scan type required",
        description: "Please select the type of scan",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("scan", selectedFile);
      formData.append("scanType", scanType);
      formData.append("tumorDetected", "false"); // Initial value, AI will update this

      const response = await apiUploadRequest(
        `/api/patients/${selectedPatientId}/scans`, 
        formData
      );
      
      const data = await response.json();

      // Invalidate queries to refresh scan data
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${selectedPatientId}/scans`] });

      setUploadComplete(true);
      toast({
        title: "Upload successful",
        description: "File has been uploaded and is being processed",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading the file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setUploadComplete(false);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title="Upload Medical Data" />
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Upload Patient Data</h2>
              <p className="text-muted-foreground">
                Upload medical imaging and lab results for AI analysis
              </p>
            </div>

            <Tabs defaultValue="medical-imaging" onValueChange={value => {
              setUploadType(value);
              resetForm();
            }}>
              <TabsList className="mb-6">
                <TabsTrigger value="medical-imaging">Medical Imaging</TabsTrigger>
                <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
                <TabsTrigger value="patient-history">Patient History</TabsTrigger>
                <TabsTrigger value="treatment-notes">Treatment Notes</TabsTrigger>
              </TabsList>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="order-2 lg:order-1">
                  <TabsContent value="medical-imaging">
                    <Card>
                      <CardHeader>
                        <CardTitle>Upload Medical Images</CardTitle>
                        <CardDescription>
                          Upload DICOM, CT, MRI, or other medical imaging files for AI analysis
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ImageUpload 
                          onUpload={handleFileUpload} 
                          accept="image/*,application/dicom,.dcm,.nii,.nii.gz" 
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="lab-results">
                    <Card>
                      <CardHeader>
                        <CardTitle>Upload Lab Results</CardTitle>
                        <CardDescription>
                          Upload lab test results as PDFs, CSVs, or images
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ImageUpload 
                          onUpload={handleFileUpload} 
                          accept=".pdf,.csv,image/*" 
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="patient-history">
                    <Card>
                      <CardHeader>
                        <CardTitle>Upload Patient History</CardTitle>
                        <CardDescription>
                          Upload patient history documents, prior treatments, and medical records
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ImageUpload 
                          onUpload={handleFileUpload} 
                          accept=".pdf,.docx,.doc,image/*" 
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="treatment-notes">
                    <Card>
                      <CardHeader>
                        <CardTitle>Upload Treatment Notes</CardTitle>
                        <CardDescription>
                          Upload treatment plans, doctor's notes, and therapy results
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ImageUpload 
                          onUpload={handleFileUpload} 
                          accept=".pdf,.docx,.doc,image/*" 
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>

                <div className="order-1 lg:order-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Options</CardTitle>
                      <CardDescription>
                        Configure how the uploaded data should be processed
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="patient">Patient</Label>
                          <Select
                            value={selectedPatientId}
                            onValueChange={setSelectedPatientId}
                          >
                            <SelectTrigger id="patient">
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

                        {uploadType === "medical-imaging" && (
                          <div>
                            <Label htmlFor="scanType">Scan Type</Label>
                            <Select
                              value={scanType}
                              onValueChange={setScanType}
                            >
                              <SelectTrigger id="scanType">
                                <SelectValue placeholder="Select scan type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CT">CT Scan</SelectItem>
                                <SelectItem value="MRI">MRI</SelectItem>
                                <SelectItem value="PET">PET Scan</SelectItem>
                                <SelectItem value="X-Ray">X-Ray</SelectItem>
                                <SelectItem value="Ultrasound">Ultrasound</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 border-t border-border pt-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="anonymize" 
                            checked={options.anonymize}
                            onCheckedChange={(checked) => 
                              setOptions({...options, anonymize: checked === true})
                            }
                          />
                          <label
                            htmlFor="anonymize"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Anonymize patient data before processing
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="processImmediately" 
                            checked={options.processImmediately}
                            onCheckedChange={(checked) => 
                              setOptions({...options, processImmediately: checked === true})
                            }
                          />
                          <label
                            htmlFor="processImmediately"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Process immediately with AI analysis
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="notifyResults" 
                            checked={options.notifyResults}
                            onCheckedChange={(checked) => 
                              setOptions({...options, notifyResults: checked === true})
                            }
                          />
                          <label
                            htmlFor="notifyResults"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Notify me when results are ready
                          </label>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={resetForm} disabled={isUploading}>
                        Reset
                      </Button>
                      <Button 
                        onClick={handleUpload} 
                        disabled={!selectedFile || isUploading || uploadComplete || !selectedPatientId}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : uploadComplete ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Uploaded
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload & Process
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Process Status Card */}
                  {(uploadComplete || isUploading) && (
                    <Card className="mt-6">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center">
                          {uploadComplete ? (
                            <>
                              <Check className="mr-2 h-5 w-5 text-success" />
                              Processing Complete
                            </>
                          ) : (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Processing Status
                            </>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">File Upload</span>
                              <span className="text-sm font-medium text-success">
                                Complete
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-success h-2 rounded-full" 
                                style={{ width: "100%" }}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">AI Processing</span>
                              <span className="text-sm font-medium">
                                {uploadComplete ? "Complete" : "In Progress"}
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className={`${uploadComplete ? "bg-success" : "bg-primary"} h-2 rounded-full`}
                                style={{ width: uploadComplete ? "100%" : "60%" }}
                              />
                            </div>
                          </div>

                          {uploadComplete && (
                            <div className="rounded-lg border border-success/20 bg-success/10 p-3 mt-4">
                              <div className="flex items-start">
                                <Check className="mt-0.5 h-5 w-5 flex-none text-success" />
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-success">
                                    Analysis complete
                                  </p>
                                  <p className="text-xs text-success/80 mt-1">
                                    View the results in the Diagnosis section
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </Tabs>

            {/* Instructions */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-primary" />
                        Supported Formats
                      </h3>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                        <li>DICOM (.dcm) - Medical imaging standard</li>
                        <li>NIfTI (.nii, .nii.gz) - Neuroimaging format</li>
                        <li>Standard images (.jpg, .png)</li>
                        <li>Documents (.pdf, .docx)</li>
                        <li>Data files (.csv, .json)</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-primary" />
                        File Requirements
                      </h3>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                        <li>Maximum file size: 25MB</li>
                        <li>Imaging resolution: minimum 512x512px</li>
                        <li>Complete metadata when available</li>
                        <li>One patient's data per upload</li>
                        <li>Anonymized data preferred</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-primary" />
                        Processing Time
                      </h3>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                        <li>Initial processing: 1-2 minutes</li>
                        <li>Quantum-enhanced analysis: 3-5 minutes</li>
                        <li>Complex 3D reconstructions: up to 10 minutes</li>
                        <li>You'll be notified when processing is complete</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
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
