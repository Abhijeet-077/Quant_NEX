import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import ModelBenchmarks from "@/components/landing/model-benchmarks-improved";
import {
  HeartPulse,
  Braces,
  BrainCircuit,
  Dna,
  Github,
  Globe,
  ArrowRight,
  Search,
  LayoutDashboard,
  Activity,
  Wand2,
  LineChart,
  Users,
  FileText,
  Zap,
  Sparkles,
  CheckCircle,
  CreditCard,
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-background border-b border-border py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
              <HeartPulse className="h-6 w-6 text-white" />
            </div>
            <span className="font-heading font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">QUANT-NEX</span>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">Benefits</a>
              <a href="#technology" className="text-muted-foreground hover:text-foreground transition-colors">Technology</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </nav>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Link href="/auth">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth?tab=register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-indigo-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <div className="animate-float">
                <span className="inline-block text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full mb-4 shadow-md">The Future of Oncology</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">QUANT-NEX</span> <br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">Precision Oncology</span>
              </h1>
              <p className="text-xl text-slate-700 dark:text-slate-300 mb-4 font-semibold italic">
                "Quant-Nex: Quantum Computing Meets AI for Unmatched Precision."
              </p>
              <p className="text-xl text-slate-700 dark:text-slate-300 mb-8">
                Revolutionizing oncology with quantum computing and AI. Precise tumor detection, personalized radiation planning, and accurate prognosis prediction all in one powerful platform.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/auth?tab=register">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="#learn-more">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950">
                    Learn More
                  </Button>
                </a>
              </div>

              {/* 3D Floating Stats */}
              <div className="mt-12 grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-lg border border-purple-200 dark:border-purple-900 transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-3 animate-pulse-slow">
                      <BrainCircuit className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">94% Accuracy</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">in tumor detection</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-lg border border-purple-200 dark:border-purple-900 transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3 animate-pulse-slow">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">1,000x Faster</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">quantum optimization</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-900 dark:to-pink-900 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>

              <div className="relative rounded-lg shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-500 animate-float-slow">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-md"></div>
                <img
                  src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                  alt="3D quantum computing visualization"
                  className="relative rounded-lg w-full object-cover z-10"
                />
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl p-4 border border-purple-200 dark:border-purple-900 z-20 animate-float-opposite">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Quantum-AI Powered</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">saving lives with precision</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">1,000x</div>
              <div className="text-muted-foreground">Faster Optimization</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">82%</div>
              <div className="text-muted-foreground">Healthy Tissue Spared</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">25K+</div>
              <div className="text-muted-foreground">Cases Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">68%</div>
              <div className="text-muted-foreground">3-Year Survival Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Comprehensive Oncology Suite</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform combines advanced quantum computing with medical expertise to deliver a complete cancer care solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Early Tumor Detection</h3>
                <p className="text-muted-foreground">
                  Quantum neural networks provide refined tumor segmentation with higher accuracy than traditional methods, detecting subtle patterns that might be missed.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Diagnosis Assistance</h3>
                <p className="text-muted-foreground">
                  AI-powered system analyzes imaging data, lab results, and patient history to suggest possible diagnoses with confidence scores.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Prognosis Prediction</h3>
                <p className="text-muted-foreground">
                  Advanced survival analysis provides estimated lifespans and treatment outcomes based on tumor characteristics and patient history.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Wand2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Radiation Optimization</h3>
                <p className="text-muted-foreground">
                  Quantum annealing and QAOA algorithms provide globally optimized radiation therapy plans that maximize tumor coverage while sparing healthy tissue.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Patient Monitoring</h3>
                <p className="text-muted-foreground">
                  Real-time tracking of vitals, lab results, and imaging data with automatic alerts for significant changes in patient condition.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <LayoutDashboard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Unified Dashboard</h3>
                <p className="text-muted-foreground">
                  Comprehensive view of patient data, imaging, diagnosis, treatment plans, and monitoring in one intuitive interface.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                Transforming Cancer Care
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our platform empowers oncologists with unprecedented tools to improve patient outcomes through precise diagnostics, optimized treatments, and continuous monitoring.
              </p>

              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Personalized Care</h3>
                    <p className="text-muted-foreground">
                      Tailored treatment plans based on individual patient data and tumor characteristics.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Improved Outcomes</h3>
                    <p className="text-muted-foreground">
                      Higher survival rates and better quality of life through optimized treatment plans.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <LineChart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Data-Driven Decisions</h3>
                    <p className="text-muted-foreground">
                      Evidence-based treatment recommendations supported by quantum-enhanced analytics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <img
                src="/assets/images/MIT-Unknown-Cancer-01.jpg"
                alt="Brain tumor visualization"
                className="rounded-lg shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt="Medical data visualization"
                className="rounded-lg shadow-lg mt-12"
              />
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt="Survival probability chart"
                className="rounded-lg shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt="Doctor profile"
                className="rounded-lg shadow-lg mt-12"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Quantum Technology</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              At the core of our platform is cutting-edge quantum computing technology that powers advanced analytics and optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BrainCircuit className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Quantum Neural Networks</h3>
              <p className="text-muted-foreground">
                Enhanced pattern recognition for tumor detection with higher sensitivity and specificity.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Braces className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">QAOA Algorithm</h3>
              <p className="text-muted-foreground">
                Quantum Approximate Optimization Algorithm for globally optimal radiation planning.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Dna className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Quantum Machine Learning</h3>
              <p className="text-muted-foreground">
                Advanced predictive models for survival analysis and treatment response forecasting.
              </p>
            </div>
          </div>

          {/* Model Benchmarks Section */}
          <div className="mb-16">
            <ModelBenchmarks />
          </div>

          <div className="bg-muted rounded-xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-heading font-bold mb-4">Cloud-Based Quantum Computing</h3>
                <p className="text-muted-foreground mb-6">
                  Our platform connects to quantum computing resources from IBM, D-Wave, and other providers through cloud APIs, making quantum power accessible without specialized hardware.
                </p>
                <div className="flex space-x-4">
                  <div className="p-2 bg-white dark:bg-card rounded-lg">
                    <img src="https://quantum-computing.ibm.com/favicon.ico" alt="IBM Quantum" className="h-8 w-8" />
                  </div>
                  <div className="p-2 bg-white dark:bg-card rounded-lg">
                    <img src="https://cloud.dwavesys.com/leap/static/favicons/favicon-32x32.png" alt="D-Wave" className="h-8 w-8" />
                  </div>
                  <div className="p-2 bg-white dark:bg-card rounded-lg">
                    <img src="https://branding.amazon.dev/assets/amazon_logo.png" alt="Amazon Braket" className="h-8 w-8" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-card p-6 rounded-lg border border-border">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Quantum API Integration</h4>
                    <p className="text-sm text-muted-foreground">Seamless access to quantum resources</p>
                  </div>
                </div>
                <pre className="bg-muted p-4 rounded-md text-xs md:text-sm overflow-x-auto">
                  <code>
{`// Quantum Optimization Example
import { QuantumInstance, QAOA } from 'qiskit';
import { DWaveSampler } from 'dwave-ocean-sdk';

// Define beam angle optimization problem
const angles = [0, 45, 90, 135, 180, 225, 270, 315];
const constraints = defineOrganConstraints();

// Solve using quantum annealing
const quantumSolver = new QuantumSolver();
const optimizedPlan = await quantumSolver.optimize({
  angles,
  constraints,
  target: { tumorCoverage: 0.95 }
});

console.log(\`Optimized plan: \${optimizedPlan.beamAngles}\`);
console.log(\`Healthy tissue spared: \${optimizedPlan.healthyTissueSpared}\`);`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for your practice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-card border border-border rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="p-6 border-b border-border">
                <h3 className="text-2xl font-heading font-bold">Basic</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">$39</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
                <p className="mt-2 text-muted-foreground">Perfect for individual practitioners</p>
              </div>
              <div className="p-6 space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Up to 50 patient records</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Basic quantum analysis</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Standard support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Basic reporting</span>
                  </li>
                </ul>
                <Link href="/auth?tab=register">
                  <Button className="w-full mt-6">Get Started</Button>
                </Link>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="bg-card border-2 border-primary rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300 relative">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <div className="p-6 border-b border-border">
                <h3 className="text-2xl font-heading font-bold">Professional</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">$79</span>
                  <span className="text-muted-foreground ml-2">/quarter</span>
                </div>
                <p className="mt-2 text-muted-foreground">Ideal for small to medium practices</p>
              </div>
              <div className="p-6 space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Unlimited patient records</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Advanced quantum analysis</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Custom reporting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Advanced visualization</span>
                  </li>
                </ul>
                <Link href="/auth?tab=register">
                  <Button className="w-full mt-6 bg-primary hover:bg-primary/90">Get Started</Button>
                </Link>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-card border border-border rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="p-6 border-b border-border">
                <h3 className="text-2xl font-heading font-bold">Enterprise</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
                <p className="mt-2 text-muted-foreground">For hospitals and research institutions</p>
              </div>
              <div className="p-6 space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Everything in Professional</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Multi-user access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>API access</span>
                  </li>
                </ul>
                <Link href="/auth?tab=register">
                  <Button className="w-full mt-6">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center p-4 bg-background border border-border rounded-lg">
              <CreditCard className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm">Secure payment processing. Cancel anytime.</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-white">
            Join the Quantum Revolution in Cancer Care
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Get access to our cutting-edge platform and transform how you diagnose, treat, and monitor cancer patients.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/auth?tab=register">
              <Button size="lg" variant="secondary">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-md">
                  <HeartPulse className="h-4 w-4 text-white" />
                </div>
                <span className="font-heading font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">QUANT-NEX</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Revolutionizing cancer care with quantum computing and artificial intelligence.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Globe className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Technology</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Security</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">API Reference</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">HIPAA Compliance</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Regulatory Information</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
            <p className="flex items-center justify-center mb-4">
              <span>© 2025 QUANT-NEX. All rights reserved.</span>
              <span className="mx-2">•</span>
              <span className="text-purple-600">Saving lives with precision</span>
            </p>
            <div className="max-w-3xl mx-auto px-4 py-3 bg-background/80 border border-border rounded-lg">
              <p className="mb-2"><strong>Disclaimer:</strong> QUANT-NEX is a predictive tool and should not be used as the sole basis for medical decisions. All predictions and analyses are based on machine learning models and quantum computing algorithms that have inherent limitations.</p>
              <p>By using this application, you acknowledge that the results provided are for informational purposes only and should be interpreted by qualified healthcare professionals.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
