import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Chatbot from "@/components/chatbot";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Patient, insertPatientSchema } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  FileText,
  Users,
  PlusCircle,
  Search,
  Calendar,
  Activity,
  Info
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function PatientsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingPatient, setIsAddingPatient] = useState(false);

  // Fetch patients
  const { data: patients, isLoading } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const patientSchema = insertPatientSchema.extend({
    patientId: z.string().min(1, "Required"),
    name: z.string().min(1, "Patient name is required"),
    age: z.coerce.number().min(1, "Age must be at least 1"),
    gender: z.string().min(1, "Gender is required"),
    cancerType: z.string().min(1, "Cancer type is required"),
    stage: z.string().min(1, "Stage is required"),
    status: z.string().default("active"),
  });

  // Form to add new patient
  const form = useForm<z.infer<typeof patientSchema>>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      patientId: `PAT-${Math.floor(Math.random() * 10000)}`,
      name: "",
      age: undefined,
      gender: "",
      cancerType: "",
      stage: "",
      status: "active",
      treatmentHistory: {},
    },
  });

  // Add patient mutation
  const addPatientMutation = useMutation({
    mutationFn: async (patient: z.infer<typeof patientSchema>) => {
      const response = await apiRequest("POST", "/api/patients", patient);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["/api/patients"]});
      toast({
        title: "Patient added successfully",
        description: "The new patient has been added to the system",
      });
      setIsAddingPatient(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to add patient",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof patientSchema>) => {
    addPatientMutation.mutate(values);
  };

  // Filter patients based on search query
  const filteredPatients = patients?.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.cancerType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'default';
      case 'remission': return 'success';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title="Patients Management" />
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Patients</h2>
                <p className="text-muted-foreground">Manage and view patient records</p>
              </div>
              <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search patients..."
                    className="pl-8 w-full sm:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Dialog open={isAddingPatient} onOpenChange={setIsAddingPatient}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Patient
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Add New Patient</DialogTitle>
                      <DialogDescription>
                        Enter the details of the new patient record.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="patientId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Patient ID</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="cancerType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cancer Type</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                  E.g., Lung, Breast, Colon
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="stage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stage</FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select stage" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Stage I">Stage I</SelectItem>
                                    <SelectItem value="Stage II">Stage II</SelectItem>
                                    <SelectItem value="Stage III">Stage III</SelectItem>
                                    <SelectItem value="Stage IV">Stage IV</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="remission">Remission</SelectItem>
                                  <SelectItem value="critical">Critical</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddingPatient(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={addPatientMutation.isPending}>
                            {addPatientMutation.isPending ? "Adding..." : "Add Patient"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="rounded-md border data-grid">
              <Table className="alternate-rows">
                <TableHeader className="data-grid-header">
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Age/Gender</TableHead>
                    <TableHead>Cancer Type</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(5).fill(0).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-[150px]" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-[120px]" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredPatients && filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.patientId}</TableCell>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>{patient.age} / {patient.gender}</TableCell>
                        <TableCell>{patient.cancerType}</TableCell>
                        <TableCell>{patient.stage}</TableCell>
                        <TableCell>
                          <Badge variant={getBadgeVariant(patient.status)}>
                            {patient.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Link href={`/dashboard?patient=${patient.patientId}`}>
                              <Button variant="outline" size="sm">
                                <Activity className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Records
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : searchQuery ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Search className="h-10 w-10 mb-2" />
                          <p>No patients found matching "{searchQuery}"</p>
                          <Button variant="link" onClick={() => setSearchQuery("")}>
                            Clear search
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Users className="h-10 w-10 mb-2" />
                          <p>No patients found</p>
                          <Button
                            variant="link"
                            onClick={() => setIsAddingPatient(true)}
                          >
                            Add your first patient
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Recently Added
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-2">
                      {Array(3).fill(0).map((_, index) => (
                        <Skeleton key={index} className="h-6 w-full" />
                      ))}
                    </div>
                  ) : patients && patients.length > 0 ? (
                    <div className="space-y-2">
                      {patients.slice(0, 3).map((patient) => (
                        <div key={patient.id} className="flex justify-between items-center">
                          <div className="text-sm">{patient.name}</div>
                          <Badge variant="outline">{patient.cancerType}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent patients</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Cancer Type Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[100px] w-full" />
                  ) : patients && patients.length > 0 ? (
                    <div className="space-y-2">
                      {Array.from(new Set(patients.map(p => p.cancerType)))
                        .slice(0, 3)
                        .map((type) => {
                          const count = patients.filter(p => p.cancerType === type).length;
                          const percentage = Math.round((count / patients.length) * 100);

                          return (
                            <div key={type} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{type}</span>
                                <span>{percentage}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No data available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Patient Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-2">
                      {Array(3).fill(0).map((_, index) => (
                        <Skeleton key={index} className="h-6 w-full" />
                      ))}
                    </div>
                  ) : patients ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Patients</span>
                        <span className="font-medium">{patients.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Active Cases</span>
                        <span className="font-medium">
                          {patients.filter(p => p.status.toLowerCase() === 'active').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Critical Cases</span>
                        <span className="font-medium text-destructive">
                          {patients.filter(p => p.status.toLowerCase() === 'critical').length}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No data available</p>
                  )}
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
