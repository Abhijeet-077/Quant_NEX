import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Prognosis } from "@shared/schema";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

interface SurvivalChartProps {
  patientId: string;
  prognosisId?: number;
  showConfidence?: boolean;
}

export default function SurvivalChart({ 
  patientId, 
  prognosisId,
  showConfidence = true
}: SurvivalChartProps) {
  // Fetch prognoses for patient
  const { data: prognoses, isLoading } = useQuery<Prognosis[]>({
    queryKey: [`/api/patients/${patientId}/prognoses`],
    enabled: !!patientId,
  });

  // Get the specific prognosis if prognosisId is provided, otherwise get the latest prognosis
  const prognosis = prognosisId 
    ? prognoses?.find(p => p.id === prognosisId) 
    : prognoses?.[0];

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (!prognosis) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">No prognosis data available</p>
      </div>
    );
  }

  // Create survival curve data points
  const survivalData = [
    { 
      months: 0, 
      survival: 1, 
      lower: 1, 
      upper: 1,
      treatment1: 1,
      treatment2: 1,
      treatment3: 1
    },
    { 
      months: 12, 
      survival: prognosis.survival1yr, 
      lower: Math.max(0, prognosis.survival1yr - 0.1), 
      upper: Math.min(1, prognosis.survival1yr + 0.1),
      treatment1: prognosis.treatmentScenarios?.[0]?.survivalRate || prognosis.survival1yr - 0.15,
      treatment2: prognosis.treatmentScenarios?.[1]?.survivalRate || prognosis.survival1yr - 0.25,
      treatment3: prognosis.treatmentScenarios?.[2]?.survivalRate || prognosis.survival1yr - 0.3
    },
    { 
      months: 36, 
      survival: prognosis.survival3yr, 
      lower: Math.max(0, prognosis.survival3yr - 0.15), 
      upper: Math.min(1, prognosis.survival3yr + 0.15),
      treatment1: prognosis.treatmentScenarios?.[0]?.survivalRate * 0.9 || prognosis.survival3yr - 0.2,
      treatment2: prognosis.treatmentScenarios?.[1]?.survivalRate * 0.8 || prognosis.survival3yr - 0.3,
      treatment3: prognosis.treatmentScenarios?.[2]?.survivalRate * 0.7 || prognosis.survival3yr - 0.35
    },
    { 
      months: 60, 
      survival: prognosis.survival5yr, 
      lower: Math.max(0, prognosis.survival5yr - 0.2), 
      upper: Math.min(1, prognosis.survival5yr + 0.2),
      treatment1: prognosis.treatmentScenarios?.[0]?.survivalRate * 0.8 || prognosis.survival5yr - 0.25,
      treatment2: prognosis.treatmentScenarios?.[1]?.survivalRate * 0.7 || prognosis.survival5yr - 0.35,
      treatment3: prognosis.treatmentScenarios?.[2]?.survivalRate * 0.6 || prognosis.survival5yr - 0.4
    }
  ];

  // Format percentage for tooltip
  const formatPercent = (value: number) => `${(value * 100).toFixed(0)}%`;

  // Customized tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="bg-white dark:bg-card shadow-md">
          <CardContent className="p-3">
            <p className="font-medium mb-1">{`${label} months`}</p>
            <p className="text-sm text-primary">{`Survival Rate: ${formatPercent(payload[0].value)}`}</p>
            {showConfidence && (
              <p className="text-xs text-muted-foreground mt-1">
                Confidence Interval: {formatPercent(payload[1]?.value)} - {formatPercent(payload[2]?.value)}
              </p>
            )}
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {showConfidence ? (
          <AreaChart
            data={survivalData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="months"
              label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              tickFormatter={formatPercent}
              domain={[0, 1]}
              label={{ value: 'Survival Probability', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="upper"
              stroke="transparent"
              fillOpacity={0.3}
              fill="url(#colorConfidence)"
              name="Upper CI"
              hide={!showConfidence}
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="transparent"
              fillOpacity={0}
              fill="transparent"
              name="Lower CI"
              hide={!showConfidence}
            />
            <Line
              type="monotone"
              dataKey="survival"
              stroke="var(--color-primary)"
              strokeWidth={3}
              activeDot={{ r: 8 }}
              name="Survival Rate"
            />
          </AreaChart>
        ) : (
          <LineChart
            data={survivalData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="months"
              label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              tickFormatter={formatPercent}
              domain={[0, 1]}
              label={{ value: 'Survival Probability', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="survival"
              stroke="var(--color-primary)"
              strokeWidth={3}
              activeDot={{ r: 8 }}
              name="Optimized Treatment"
            />
            <Line
              type="monotone"
              dataKey="treatment1"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              name="Radiation + Immunotherapy"
            />
            <Line
              type="monotone"
              dataKey="treatment2"
              stroke="var(--color-chart-3)"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              name="Radiation Alone"
            />
            <Line
              type="monotone"
              dataKey="treatment3"
              stroke="var(--color-chart-4)"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              name="Surgery + Radiation"
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
