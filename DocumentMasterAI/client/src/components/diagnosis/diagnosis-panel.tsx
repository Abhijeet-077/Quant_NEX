import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Diagnosis } from "@shared/schema";
import { RefreshCw, FileText } from "lucide-react";

interface DiagnosisPanelProps {
  patientId: string;
  diagnosisId?: number;
}

export default function DiagnosisPanel({ patientId, diagnosisId }: DiagnosisPanelProps) {
  // Fetch diagnoses for patient
  const { data: diagnoses, isLoading } = useQuery<Diagnosis[]>({
    queryKey: [`/api/patients/${patientId}/diagnoses`],
    enabled: !!patientId,
  });

  // Get the specific diagnosis if diagnosisId is provided, otherwise get the latest diagnosis
  const diagnosis = diagnosisId 
    ? diagnoses?.find(d => d.id === diagnosisId) 
    : diagnoses?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card>
      <CardHeader className="pb-4 flex flex-row justify-between">
        <div>
          <CardTitle>AI Diagnosis Assistance</CardTitle>
          <CardDescription>
            {diagnosis 
              ? `Last updated: ${formatDate(diagnosis.updatedAt)}` 
              : 'No diagnosis data available'}
          </CardDescription>
        </div>
        <Badge variant="outline">Quantum-enhanced</Badge>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : diagnosis ? (
          <>
            {/* Primary Diagnosis */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-foreground">Primary Diagnosis</h4>
                  <p className="text-sm text-muted-foreground">Based on imaging, lab results, and patient history</p>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {Math.round(diagnosis.confidence * 100)}% confidence
                </Badge>
              </div>
              
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-2">
                <h5 className="font-medium text-primary-800 dark:text-primary-300 mb-1">{diagnosis.primaryDiagnosis}</h5>
                <p className="text-sm text-primary-700 dark:text-primary-400">{diagnosis.details}</p>
              </div>
            </div>
            
            {/* Alternative Diagnoses */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Alternative Considerations</h4>
              
              <ul className="space-y-3">
                {diagnosis.alternativeDiagnoses && Array.isArray(diagnosis.alternativeDiagnoses) && 
                  diagnosis.alternativeDiagnoses.map((altDiagnosis: any, index: number) => (
                    <li key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{altDiagnosis.diagnosis}</p>
                        <p className="text-xs text-muted-foreground">
                          {altDiagnosis.details || 'Similar radiographic pattern, differentiated by cell type'}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {Math.round(altDiagnosis.confidence * 100)}%
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">No diagnosis data available</p>
            <p className="text-sm text-muted-foreground">Generate a diagnosis from the "Diagnosis" page</p>
          </div>
        )}
      </CardContent>
      
      {diagnosis && (
        <CardFooter className="bg-muted/50 p-4 border-t border-border flex justify-between items-center">
          <div className="flex items-center text-sm">
            <RefreshCw className="text-muted-foreground mr-1 text-base" />
            <span className="text-muted-foreground">Last updated: {formatDate(diagnosis.updatedAt)}</span>
          </div>
          <Button variant="outline" size="sm" className="text-primary">
            <FileText className="mr-1 text-sm" />
            Supporting Evidence
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
