import { useQuery } from "@tanstack/react-query";
import { Scan } from "@shared/schema";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface TumorTrackingProps {
  patientId: string;
  timeframe?: string;
}

export default function TumorTracking({ 
  patientId, 
  timeframe = "30-days" 
}: TumorTrackingProps) {
  // Fetch scans for patient
  const { data: scans, isLoading } = useQuery<Scan[]>({
    queryKey: [`/api/patients/${patientId}/scans`],
    enabled: !!patientId,
  });

  if (isLoading) {
    return <Skeleton className="h-[240px] w-full" />;
  }

  if (!scans || scans.length === 0) {
    return (
      <div className="h-[240px] flex items-center justify-center">
        <p className="text-muted-foreground">No scan data available</p>
      </div>
    );
  }

  // Filter scans based on timeframe
  const filteredScans = (() => {
    if (timeframe === "all-time") return scans;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    if (timeframe === "30-days") {
      cutoffDate.setDate(now.getDate() - 30);
    } else if (timeframe === "90-days") {
      cutoffDate.setDate(now.getDate() - 90);
    }
    
    return scans.filter(scan => new Date(scan.uploadedAt) >= cutoffDate);
  })();
  
  // Sort scans by date
  const sortedScans = [...filteredScans].sort(
    (a, b) => new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
  );

  // Format data for chart
  const chartData = sortedScans.map(scan => {
    const scanDate = new Date(scan.uploadedAt);
    return {
      date: scanDate.toLocaleDateString(),
      timestamp: scanDate.getTime(),
      size: scan.tumorSize,
      malignancy: scan.malignancyScore,
      growthRate: scan.growthRate
    };
  });

  // Format for tooltip
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="bg-white dark:bg-card shadow-md">
          <CardContent className="p-3">
            <p className="font-medium mb-1">{formatDate(label)}</p>
            <p className="text-sm text-primary">
              Tumor Size: {payload[0].value.toFixed(1)} cm
            </p>
            {payload[1] && (
              <p className="text-xs text-muted-foreground">
                Malignancy Score: {(payload[1].value * 100).toFixed(0)}%
              </p>
            )}
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            label={{ 
              value: 'Size (cm)', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' },
              offset: -5
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 1]}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            label={{ 
              value: 'Malignancy', 
              angle: 90, 
              position: 'insideRight',
              style: { textAnchor: 'middle' },
              offset: 0
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="size"
            name="Tumor Size"
            stroke="var(--color-primary)"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="malignancy"
            name="Malignancy Score"
            stroke="var(--color-chart-2)"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}