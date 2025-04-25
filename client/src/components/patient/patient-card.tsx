import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Patient } from "@shared/schema";
import { Ticket, Briefcase, History, Edit } from "lucide-react";

interface PatientCardProps {
  patient: Patient;
  patientsList?: Patient[];
  onPatientChange?: (patientId: string) => void;
}

export default function PatientCard({
  patient,
  patientsList,
  onPatientChange
}: PatientCardProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patient.patientId);

  const handlePatientChange = (patientId: string) => {
    setSelectedPatientId(patientId);
    if (onPatientChange) {
      onPatientChange(patientId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="lg:col-span-1 bg-white dark:bg-card overflow-hidden hover-card transition-all duration-300">
      <CardHeader className="pb-0">
        {patientsList && patientsList.length > 0 && (
          <Select value={selectedPatientId} onValueChange={handlePatientChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              {patientsList.map((p) => (
                <SelectItem key={p.id} value={p.patientId}>
                  {p.name} ({p.patientId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{patient.name}</h3>
            <p className="text-muted-foreground text-sm">ID: #{patient.patientId}</p>
          </div>
          <Badge variant={
            patient.status === "active" ? "default" :
            patient.status === "remission" ? "success" :
            patient.status === "critical" ? "destructive" :
            "secondary"
          }>
            {patient.status}
          </Badge>
        </div>

        <div className="border-t border-b border-border py-3 mb-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Age</p>
              <p className="font-medium text-foreground">{patient.age}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Gender</p>
              <p className="font-medium text-foreground">{patient.gender}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Cancer Type</p>
              <p className="font-medium text-foreground">{patient.cancerType}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Stage</p>
              <p className="font-medium text-foreground">{patient.stage}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Recent Activity</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <Ticket className="text-primary mr-2 text-base" />
              <div>
                <p className="text-foreground">CT Scan Uploaded</p>
                <p className="text-muted-foreground text-xs">{formatDate(patient.updatedAt)}</p>
              </div>
            </li>
            <li className="flex items-start">
              <Briefcase className="text-primary mr-2 text-base" />
              <div>
                <p className="text-foreground">Lab Results Updated</p>
                <p className="text-muted-foreground text-xs">{formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())}</p>
              </div>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t border-border">
        <Button variant="ghost" size="sm" className="text-primary">
          <History className="h-4 w-4 mr-1" />
          History
        </Button>
        <Button variant="ghost" size="sm" className="text-primary">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
