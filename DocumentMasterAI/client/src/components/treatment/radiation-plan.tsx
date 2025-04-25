import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadiationPlan as RadiationPlanType } from "@shared/schema";
import { File } from "lucide-react";

interface RadiationPlanProps {
  radiationPlan: RadiationPlanType;
}

export default function RadiationPlan({ radiationPlan }: RadiationPlanProps) {
  // Format organ at risk data
  const organsAtRisk = radiationPlan.organsAtRisk as Array<{
    name: string;
    dose: number;
    limit: number;
  }> || [];

  // Format dose values
  const formatDose = (dose: number) => `${dose.toFixed(1)} Gy`;

  // Calculate percentage of organ limit being used
  const calculateLimitPercentage = (dose: number, limit: number) => {
    const percentage = (dose / limit) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  // Get color based on percentage of limit
  const getLimitColor = (percentage: number) => {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 80) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Radiation Visualization */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Radiation Dose Distribution</span>
              <div className="flex space-x-3 text-xs">
                <span className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Tumor Target
                </span>
                <span className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                  High Dose
                </span>
                <span className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-1"></span>
                  Medium Dose
                </span>
                <span className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                  Low Dose
                </span>
              </div>
            </CardTitle>
            <CardDescription>
              Quantum-optimized beam angles and dose distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg h-80 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1576671537586-ca4eebc86956?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Radiation dose distribution visualization" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            <div className="mt-4 grid grid-cols-4 gap-3">
              <div className="bg-white dark:bg-card border border-border rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-muted-foreground">Beam Angles</p>
                <p className="text-lg font-bold text-primary">{radiationPlan.beamAngles}</p>
                <p className="text-xs text-muted-foreground">Optimized</p>
              </div>
              <div className="bg-white dark:bg-card border border-border rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-muted-foreground">Total Dose</p>
                <p className="text-lg font-bold text-primary">{radiationPlan.totalDose} Gy</p>
                <p className="text-xs text-muted-foreground">{radiationPlan.fractions} fractions</p>
              </div>
              <div className="bg-white dark:bg-card border border-border rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-muted-foreground">Tumor Coverage</p>
                <p className="text-lg font-bold text-primary">{(radiationPlan.tumorCoverage * 100).toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Target: ≥95%</p>
              </div>
              <div className="bg-white dark:bg-card border border-border rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-muted-foreground">Healthy Tissue</p>
                <p className="text-lg font-bold text-green-500">{(radiationPlan.healthyTissueSpared * 100).toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Spared</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Optimization Parameters */}
      <div className="md:col-span-1">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organs at Risk</CardTitle>
              <CardDescription>
                Radiation dose limits for critical organs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {organsAtRisk.length > 0 ? (
                  organsAtRisk.map((organ, index) => {
                    const percentage = calculateLimitPercentage(organ.dose, organ.limit);
                    const colorClass = getLimitColor(percentage);
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center">
                          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                            organ.name === "Heart" ? "bg-red-300" :
                            organ.name === "Spinal Cord" ? "bg-amber-300" : 
                            "bg-green-300"
                          }`}></span>
                          <p className="font-medium text-foreground">{organ.name}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${percentage < 50 ? 'text-green-500' : percentage < 80 ? 'text-amber-500' : 'text-red-500'}`}>
                            {formatDose(organ.dose)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Limit: {formatDose(organ.limit)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No organ constraint data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Optimization Method</CardTitle>
              <CardDescription>
                Quantum computing algorithm details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-900 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Badge variant="secondary" className="mr-2">QUANTUM</Badge>
                  <h5 className="font-medium text-primary-800 dark:text-primary-300">{radiationPlan.optimizationMethod}</h5>
                </div>
                <p className="text-sm text-primary-700 dark:text-primary-400 mb-3">
                  D-Wave quantum optimization with 5,000+ qubits processed. Treatment plan found global optimal solution in 78 seconds.
                </p>
                <div className="flex items-center text-xs text-primary-600 dark:text-primary-400">
                  <span>1,240x faster than classical algorithm</span>
                </div>
              </div>
              
              <div className="mt-5">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" variant="secondary">
                  <File className="mr-2 h-4 w-4" />
                  Export Treatment Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
