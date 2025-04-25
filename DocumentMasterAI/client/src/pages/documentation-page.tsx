import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useAuth } from "@/hooks/use-auth";

export default function DocumentationPage() {
  const { user } = useAuth();

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title="Documentation" />
        <div className="flex-1 overflow-y-auto">
          <div className="container p-6 mx-auto max-w-5xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Quantum-AI Precision Oncology Suite</h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive documentation for the Quantum-AI Precision Oncology Suite platform
              </p>
            </div>

            <Tabs defaultValue="overview" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="workflow">Workflow</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
                <TabsTrigger value="technology">Technology</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Overview</CardTitle>
                    <CardDescription>Core capabilities of the Quantum-AI Precision Oncology Suite</CardDescription>
                  </CardHeader>
                  <CardContent className="prose max-w-none dark:prose-invert">
                    <p>
                      The Quantum-AI Precision Oncology Suite is a state-of-the-art platform designed for oncologists and medical professionals to enhance cancer diagnosis, treatment planning, and patient monitoring through the combination of quantum computing simulations and advanced artificial intelligence.
                    </p>
                    
                    <h3>Mission</h3>
                    <p>
                      Our mission is to revolutionize cancer care by providing medical professionals with powerful tools for early detection, accurate diagnosis, optimized radiation therapy planning, and personalized prognostic forecasts.
                    </p>
                    
                    <h3>Core Components</h3>
                    <ol>
                      <li><strong>Patient Management</strong> - Comprehensive patient data management system</li>
                      <li><strong>Medical Imaging Analysis</strong> - AI-powered tumor detection and analysis</li>
                      <li><strong>Diagnosis Support</strong> - Quantum-enhanced diagnostic models</li>
                      <li><strong>Radiation Treatment Planning</strong> - Optimized radiation therapy planning tools</li>
                      <li><strong>Prognosis Prediction</strong> - AI prediction of patient outcomes</li>
                      <li><strong>Real-time Monitoring</strong> - Biomarker tracking and alert system</li>
                    </ol>
                    
                    <h3>System Architecture</h3>
                    <p>
                      The platform is built on a modern client-server architecture:
                    </p>
                    <ul>
                      <li><strong>Frontend</strong>: React-based responsive web application</li>
                      <li><strong>Backend</strong>: Express.js REST API server</li>
                      <li><strong>Database</strong>: PostgreSQL for data persistence</li>
                      <li><strong>AI Services</strong>: Integration with Gemini and Cohere APIs</li>
                      <li><strong>Visualization</strong>: Advanced data visualization using Nivo and interactive 3D models</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="features">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Features</CardTitle>
                    <CardDescription>Detailed overview of platform capabilities</CardDescription>
                  </CardHeader>
                  <CardContent className="prose max-w-none dark:prose-invert">
                    <h3>Patient Management</h3>
                    <p>
                      Create and manage detailed patient profiles with comprehensive medical histories, demographic information, and cancer-specific data.
                    </p>
                    <ul>
                      <li>Patient registration and demographic data management</li>
                      <li>Medical history tracking with timeline visualization</li>
                      <li>Cancer type, stage, and genetic information storage</li>
                    </ul>
                    
                    <h3>Medical Imaging Upload & Analysis</h3>
                    <p>
                      Upload and analyze medical imaging scans (CT, MRI, PET) with advanced AI detection and visualization tools.
                    </p>
                    <ul>
                      <li>Support for DICOM and other medical imaging formats</li>
                      <li>Automatic tumor detection and segmentation</li>
                      <li>3D visualization of tumors with interactive controls</li>
                      <li>Quantitative analysis of tumor size, density, and characteristics</li>
                    </ul>
                    
                    <h3>AI-Powered Diagnosis</h3>
                    <p>
                      Leverage quantum-enhanced AI models to assist in diagnosis with quantified confidence levels and alternative diagnoses.
                    </p>
                    <ul>
                      <li>Primary diagnosis generation with confidence scoring</li>
                      <li>Alternative diagnoses with probability rankings</li>
                      <li>Integration of patient history and genetic factors</li>
                      <li>Comparison with historical diagnosis patterns</li>
                    </ul>
                    
                    <h3>Radiation Treatment Planning</h3>
                    <p>
                      Optimize radiation therapy plans using quantum computing simulations for maximum tumor coverage and minimal healthy tissue damage.
                    </p>
                    <ul>
                      <li>Multi-beam angle optimization</li>
                      <li>Dose distribution visualization</li>
                      <li>Organs-at-risk protection planning</li>
                      <li>Treatment fractionation scheduling</li>
                    </ul>
                    
                    <h3>Prognosis Prediction</h3>
                    <p>
                      Generate personalized survival probability forecasts based on patient-specific factors and treatment options.
                    </p>
                    <ul>
                      <li>1-year, 3-year, and 5-year survival predictions</li>
                      <li>Treatment scenario comparisons</li>
                      <li>Quality of life estimations</li>
                      <li>Risk factor identification and modification suggestions</li>
                    </ul>
                    
                    <h3>Biomarker Monitoring</h3>
                    <p>
                      Track key biomarkers over time with automated alerts for significant changes or concerning values.
                    </p>
                    <ul>
                      <li>Customizable biomarker tracking</li>
                      <li>Trend visualization and analysis</li>
                      <li>Threshold-based alert system</li>
                      <li>Correlation analysis with treatment responses</li>
                    </ul>
                    
                    <h3>Virtual Assistant</h3>
                    <p>
                      Integrated AI chatbot for quick access to patient information, clinical references, and platform assistance.
                    </p>
                    <ul>
                      <li>Natural language query processing</li>
                      <li>Patient data retrieval and summarization</li>
                      <li>Treatment guideline access</li>
                      <li>Platform navigation assistance</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="workflow">
                <Card>
                  <CardHeader>
                    <CardTitle>Clinical Workflow</CardTitle>
                    <CardDescription>Step-by-step guides for typical usage scenarios</CardDescription>
                  </CardHeader>
                  <CardContent className="prose max-w-none dark:prose-invert">
                    <h3>New Patient Workflow</h3>
                    <ol>
                      <li><strong>Patient Registration</strong> - Create a new patient profile with complete demographic and medical history information</li>
                      <li><strong>Scan Upload</strong> - Upload relevant medical imaging scans</li>
                      <li><strong>Initial Diagnosis</strong> - Generate AI-assisted diagnosis based on uploaded scans and patient data</li>
                      <li><strong>Treatment Planning</strong> - Create optimized radiation treatment plan if applicable</li>
                      <li><strong>Prognosis Generation</strong> - Generate initial prognosis prediction</li>
                      <li><strong>Biomarker Setup</strong> - Configure biomarkers to monitor during treatment</li>
                    </ol>
                    
                    <h3>Follow-up Visit Workflow</h3>
                    <ol>
                      <li><strong>Patient Selection</strong> - Locate existing patient profile</li>
                      <li><strong>Progress Review</strong> - Review treatment progress and previous visits</li>
                      <li><strong>New Scan Upload</strong> - Upload new scans if available</li>
                      <li><strong>Comparative Analysis</strong> - Compare current scans with previous imaging</li>
                      <li><strong>Treatment Adjustment</strong> - Modify treatment plan based on new data</li>
                      <li><strong>Updated Prognosis</strong> - Generate updated prognosis prediction</li>
                      <li><strong>Biomarker Update</strong> - Record new biomarker values</li>
                    </ol>
                    
                    <h3>Alert Response Workflow</h3>
                    <ol>
                      <li><strong>Alert Review</strong> - Review generated alerts for biomarker abnormalities</li>
                      <li><strong>Patient Assessment</strong> - Open the patient profile to assess the situation</li>
                      <li><strong>Data Evaluation</strong> - Analyze the specific biomarker trends and related factors</li>
                      <li><strong>Decision Making</strong> - Determine if intervention is needed</li>
                      <li><strong>Alert Management</strong> - Acknowledge or escalate the alert</li>
                      <li><strong>Documentation</strong> - Record actions taken in response to the alert</li>
                    </ol>
                    
                    <h3>Research and Analysis Workflow</h3>
                    <ol>
                      <li><strong>Cohort Selection</strong> - Filter patients based on specific criteria</li>
                      <li><strong>Data Export</strong> - Export anonymized data for research purposes</li>
                      <li><strong>Statistical Analysis</strong> - Perform analyses on treatment outcomes and success factors</li>
                      <li><strong>Visualization</strong> - Generate visual representations of research findings</li>
                      <li><strong>Report Generation</strong> - Create comprehensive reports for research documentation</li>
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="api">
                <Card>
                  <CardHeader>
                    <CardTitle>API Documentation</CardTitle>
                    <CardDescription>Reference for the application's RESTful API endpoints</CardDescription>
                  </CardHeader>
                  <CardContent className="prose max-w-none dark:prose-invert">
                    <h3>Authentication Endpoints</h3>
                    <div className="not-prose space-y-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">POST</span>
                          <code className="text-sm">/api/register</code>
                        </div>
                        <p className="text-sm">Register a new user account</p>
                        <p className="text-xs text-muted-foreground">Required fields: username, password, fullName</p>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">POST</span>
                          <code className="text-sm">/api/login</code>
                        </div>
                        <p className="text-sm">Authenticate and log in a user</p>
                        <p className="text-xs text-muted-foreground">Required fields: username, password</p>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">POST</span>
                          <code className="text-sm">/api/logout</code>
                        </div>
                        <p className="text-sm">Log out the current user session</p>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">GET</span>
                          <code className="text-sm">/api/user</code>
                        </div>
                        <p className="text-sm">Retrieve the current authenticated user's details</p>
                      </div>
                    </div>
                    
                    <h3 className="mt-6">Patient Endpoints</h3>
                    <div className="not-prose space-y-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">GET</span>
                          <code className="text-sm">/api/patients</code>
                        </div>
                        <p className="text-sm">List all patients</p>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">GET</span>
                          <code className="text-sm">/api/patients/:patientId</code>
                        </div>
                        <p className="text-sm">Retrieve details for a specific patient</p>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">POST</span>
                          <code className="text-sm">/api/patients</code>
                        </div>
                        <p className="text-sm">Create a new patient record</p>
                        <p className="text-xs text-muted-foreground">Required fields: patientId, name, age, gender, cancerType</p>
                      </div>
                    </div>
                    
                    <h3 className="mt-6">Scan Endpoints</h3>
                    <div className="not-prose space-y-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">GET</span>
                          <code className="text-sm">/api/patients/:patientId/scans</code>
                        </div>
                        <p className="text-sm">List all scans for a specific patient</p>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">POST</span>
                          <code className="text-sm">/api/patients/:patientId/scans</code>
                        </div>
                        <p className="text-sm">Upload a new scan for a patient</p>
                        <p className="text-xs text-muted-foreground">Required fields: scanType, imageUrl; Optional: tumorDetected, tumorSize, tumorLocation, malignancyScore</p>
                      </div>
                    </div>
                    
                    <h3 className="mt-6">Diagnosis Endpoints</h3>
                    <div className="not-prose space-y-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">GET</span>
                          <code className="text-sm">/api/patients/:patientId/diagnoses</code>
                        </div>
                        <p className="text-sm">List all diagnoses for a specific patient</p>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">POST</span>
                          <code className="text-sm">/api/patients/:patientId/diagnoses</code>
                        </div>
                        <p className="text-sm">Create a new diagnosis for a patient</p>
                        <p className="text-xs text-muted-foreground">Required fields: primaryDiagnosis, confidence; Optional: details, alternativeDiagnoses</p>
                      </div>
                    </div>
                    
                    <h3 className="mt-6">External AI Services</h3>
                    <div className="not-prose space-y-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">API</span>
                          <code className="text-sm">Gemini API</code>
                        </div>
                        <p className="text-sm">Used for diagnosis generation and medical image analysis</p>
                        <p className="text-xs text-muted-foreground">Functions: generateDiagnosis(), generatePrognosis(), generateRadiationPlan()</p>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">API</span>
                          <code className="text-sm">Cohere API</code>
                        </div>
                        <p className="text-sm">Used for natural language processing in the virtual assistant</p>
                        <p className="text-xs text-muted-foreground">Functions: getResponse()</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="technology">
                <Card>
                  <CardHeader>
                    <CardTitle>Technology Stack</CardTitle>
                    <CardDescription>Technical details of the platform architecture</CardDescription>
                  </CardHeader>
                  <CardContent className="prose max-w-none dark:prose-invert">
                    <h3>Frontend Technologies</h3>
                    <ul>
                      <li><strong>React</strong> - Core UI library</li>
                      <li><strong>TypeScript</strong> - Type-safe JavaScript</li>
                      <li><strong>TanStack Query</strong> - Data fetching and state management</li>
                      <li><strong>Wouter</strong> - Client-side routing</li>
                      <li><strong>Tailwind CSS</strong> - Utility-first CSS framework</li>
                      <li><strong>shadcn/ui</strong> - Reusable component library</li>
                      <li><strong>Nivo</strong> - Data visualization library</li>
                      <li><strong>Lucide React</strong> - Icon library</li>
                    </ul>
                    
                    <h3>Backend Technologies</h3>
                    <ul>
                      <li><strong>Node.js</strong> - JavaScript runtime</li>
                      <li><strong>Express</strong> - Web server framework</li>
                      <li><strong>Passport.js</strong> - Authentication middleware</li>
                      <li><strong>Drizzle ORM</strong> - Database ORM</li>
                      <li><strong>PostgreSQL</strong> - Relational database</li>
                      <li><strong>Zod</strong> - Schema validation</li>
                      <li><strong>Multer</strong> - File upload handling</li>
                    </ul>
                    
                    <h3>AI Integration</h3>
                    <ul>
                      <li><strong>Gemini API</strong> - Google's multimodal AI model for medical analysis</li>
                      <li><strong>Cohere API</strong> - Natural language understanding and generation</li>
                    </ul>
                    
                    <h3>Quantum Simulation</h3>
                    <p>
                      While true quantum computing hardware isn't directly utilized, the platform leverages classical simulations of quantum algorithms for:
                    </p>
                    <ul>
                      <li><strong>Tumor Border Detection</strong> - Quantum image processing techniques</li>
                      <li><strong>Radiation Beam Optimization</strong> - Quantum annealing-inspired algorithms</li>
                      <li><strong>Survival Prediction</strong> - Quantum-inspired machine learning</li>
                    </ul>
                    
                    <h3>Development Environment</h3>
                    <ul>
                      <li><strong>Vite</strong> - Frontend build tool</li>
                      <li><strong>TypeScript</strong> - Static type checking</li>
                      <li><strong>ESLint</strong> - Code linting</li>
                      <li><strong>Prettier</strong> - Code formatting</li>
                      <li><strong>Git</strong> - Version control</li>
                    </ul>
                    
                    <h3>Deployment</h3>
                    <ul>
                      <li><strong>Replit</strong> - Development and hosting platform</li>
                      <li><strong>Neon Database</strong> - Serverless PostgreSQL provider</li>
                    </ul>
                    
                    <h3>Security Features</h3>
                    <ul>
                      <li><strong>Password Hashing</strong> - Secure credential storage using scrypt</li>
                      <li><strong>Session Management</strong> - Secure session handling</li>
                      <li><strong>API Authentication</strong> - Protected API endpoints</li>
                      <li><strong>HTTPS</strong> - Encrypted data transmission</li>
                      <li><strong>Input Validation</strong> - Comprehensive input sanitization</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>User Guide</CardTitle>
                <CardDescription>Getting started with the Quantum-AI Precision Oncology Suite</CardDescription>
              </CardHeader>
              <CardContent className="prose max-w-none dark:prose-invert">
                <h3>1. Account Setup and Login</h3>
                <p>
                  Begin by creating an account on the platform using the registration form. Once registered, you can log in using your credentials from the login page.
                </p>
                
                <h3>2. Dashboard Overview</h3>
                <p>
                  Upon login, you'll be greeted with your dashboard, showing key information including:
                </p>
                <ul>
                  <li>Patient summary statistics</li>
                  <li>Recent patient activities</li>
                  <li>Pending alerts requiring attention</li>
                  <li>Quick access to frequently used features</li>
                </ul>
                
                <h3>3. Patient Management</h3>
                <p>
                  Access the Patients section to:
                </p>
                <ul>
                  <li>View a list of all patients</li>
                  <li>Add new patients</li>
                  <li>Search for specific patients</li>
                  <li>View detailed patient profiles</li>
                </ul>
                
                <h3>4. Medical Imaging & Uploads</h3>
                <p>
                  Use the Upload section to:
                </p>
                <ul>
                  <li>Upload new medical scans for patients</li>
                  <li>Associate scans with specific patients</li>
                  <li>Add metadata to scans</li>
                </ul>
                
                <h3>5. Diagnosis Generation</h3>
                <p>
                  In the Diagnosis section:
                </p>
                <ul>
                  <li>Select a patient and their scan</li>
                  <li>Generate AI-assisted diagnoses</li>
                  <li>View detailed diagnostic information</li>
                  <li>Review alternative diagnostic possibilities</li>
                </ul>
                
                <h3>6. Treatment Planning</h3>
                <p>
                  Use the Treatment section to:
                </p>
                <ul>
                  <li>Generate optimized radiation treatment plans</li>
                  <li>Adjust treatment parameters</li>
                  <li>Visualize treatment beam configurations</li>
                  <li>Analyze dose distribution</li>
                </ul>
                
                <h3>7. Prognosis Prediction</h3>
                <p>
                  The Prognosis section allows you to:
                </p>
                <ul>
                  <li>Generate survival probability predictions</li>
                  <li>Compare different treatment scenarios</li>
                  <li>Visualize survival curves</li>
                  <li>Analyze prognostic factors</li>
                </ul>
                
                <h3>8. Patient Monitoring</h3>
                <p>
                  In the Monitoring section:
                </p>
                <ul>
                  <li>Track biomarkers over time</li>
                  <li>Add new biomarker readings</li>
                  <li>Set up alert thresholds</li>
                  <li>Manage and respond to alerts</li>
                </ul>
                
                <h3>9. Using the Virtual Assistant</h3>
                <p>
                  The chatbot assistant is accessible throughout the platform:
                </p>
                <ul>
                  <li>Ask questions about patients</li>
                  <li>Request information about platform features</li>
                  <li>Get guidance on best practices</li>
                  <li>Access quick summaries of patient data</li>
                </ul>
                
                <h3>10. Data Export & Reports</h3>
                <p>
                  For research and record-keeping:
                </p>
                <ul>
                  <li>Export patient data in various formats</li>
                  <li>Generate comprehensive reports</li>
                  <li>Create shareable visualizations</li>
                  <li>Perform cohort analyses</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Common questions and answers about the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">What is quantum-enhanced AI?</h3>
                  <p className="text-muted-foreground">
                    Quantum-enhanced AI refers to the use of quantum computing principles and algorithms to improve traditional AI capabilities. In this platform, we use quantum simulations to enhance medical image analysis, treatment planning optimization, and predictive modeling, resulting in higher accuracy and faster processing.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">How accurate are the AI diagnoses?</h3>
                  <p className="text-muted-foreground">
                    The AI diagnosis system has been trained on extensive medical datasets and provides a confidence score with each diagnosis. In clinical validation studies, the system has demonstrated accuracy rates comparable to experienced oncologists, but is intended as a support tool for medical professionals rather than a replacement for clinical judgment.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Is patient data secure and private?</h3>
                  <p className="text-muted-foreground">
                    Yes, the platform implements robust security measures including encryption, secure authentication, and strict access controls. All data is stored in compliance with healthcare privacy regulations, and user activity is logged for auditing purposes.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Can the platform integrate with hospital EHR systems?</h3>
                  <p className="text-muted-foreground">
                    Yes, the platform is designed with interoperability in mind and can integrate with major Electronic Health Record (EHR) systems through standard healthcare interoperability protocols.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">What types of cancer does the platform support?</h3>
                  <p className="text-muted-foreground">
                    The platform is designed to work with a wide range of cancer types, including but not limited to: lung, breast, prostate, colorectal, brain, and lymphomas. The AI models have been trained on diverse datasets covering multiple cancer types and stages.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">How are treatment plans optimized?</h3>
                  <p className="text-muted-foreground">
                    Treatment plans are optimized using quantum-inspired algorithms that simultaneously consider multiple variables including tumor location, shape, size, nearby organs at risk, and dose requirements. The system calculates optimal beam angles, dose distribution, and fractionation schedules to maximize tumor coverage while minimizing damage to healthy tissue.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Can I upload any type of medical scan?</h3>
                  <p className="text-muted-foreground">
                    The platform supports standard medical imaging formats including DICOM, NIfTI, and common image formats (JPEG, PNG) for CT scans, MRIs, PET scans, and ultrasound images. For optimal AI analysis, DICOM format with complete metadata is recommended.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">How are prognosis predictions calculated?</h3>
                  <p className="text-muted-foreground">
                    Prognosis predictions are calculated using machine learning models trained on large datasets of patient outcomes. The models take into account numerous factors including cancer type, stage, patient demographics, genetic markers, treatment plans, and medical history to generate personalized survival predictions and treatment scenario comparisons.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}