import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Biomarker } from "@shared/schema";
import { TrendingDown, TrendingUp, Minus } from "@/lib/icons";

interface BiomarkerChartProps {
  biomarkers: Biomarker[];
  timeframe?: string;
}

export default function BiomarkerChart({ biomarkers, timeframe = "30-days" }: BiomarkerChartProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Group biomarkers by type
  const biomarkersByType = biomarkers.reduce((acc, biomarker) => {
    if (!acc[biomarker.type]) {
      acc[biomarker.type] = [];
    }
    acc[biomarker.type].push(biomarker);
    return acc;
  }, {} as Record<string, Biomarker[]>);

  // Sort each type's biomarkers by date
  Object.keys(biomarkersByType).forEach(type => {
    biomarkersByType[type].sort((a, b) => 
      new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
    );
  });

  // Filter biomarker types - show only the most recent of each type if not selected
  const biomarkerTypes = Object.keys(biomarkersByType);
  
  // Get the most recent biomarker for each type
  const latestBiomarkers = biomarkerTypes.map(type => {
    const typeBiomarkers = biomarkersByType[type];
    return typeBiomarkers[typeBiomarkers.length - 1];
  });

  // Get trend icon based on trend value
  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'up':
        return <TrendingUp className="text-red-500 h-4 w-4 ml-1" />;
      case 'down':
        return <TrendingDown className="text-green-500 h-4 w-4 ml-1" />;
      default:
        return <Minus className="text-amber-500 h-4 w-4 ml-1" />;
    }
  };

  // Get color based on whether value is in normal range
  const getValueColor = (value: number, normalLow?: number | null, normalHigh?: number | null) => {
    if (normalLow !== undefined && normalLow !== null && value < normalLow) {
      return "text-amber-500";
    }
    if (normalHigh !== undefined && normalHigh !== null && value > normalHigh) {
      return "text-red-500";
    }
    return "text-green-500";
  };

  // Calculate progress percentage for progress bars
  const getProgressPercentage = (value: number, normalLow: number | null | undefined, normalHigh: number | null | undefined) => {
    if (normalLow === undefined || normalLow === null || normalHigh === undefined || normalHigh === null) {
      return 50; // Default to middle if no normal range
    }
    
    const range = normalHigh - normalLow;
    const position = value - normalLow;
    
    let percentage = (position / range) * 100;
    percentage = Math.max(0, Math.min(percentage, 100)); // Clamp between 0-100
    
    return percentage;
  };

  // Filter to only show biomarkers within the selected timeframe
  const getTimeframedBiomarkers = () => {
    if (selectedType === null) {
      return latestBiomarkers;
    }
    
    const now = new Date();
    let cutoffDate = new Date();
    
    if (timeframe === "30-days") {
      cutoffDate.setDate(now.getDate() - 30);
    } else if (timeframe === "90-days") {
      cutoffDate.setDate(now.getDate() - 90);
    } else {
      // All time - no filtering
      return biomarkersByType[selectedType];
    }
    
    return biomarkersByType[selectedType].filter(biomarker => 
      new Date(biomarker.recordedAt) >= cutoffDate
    );
  };

  const displayedBiomarkers = getTimeframedBiomarkers();

  return (
    <div className="space-y-3">
      {displayedBiomarkers.map((biomarker, index) => (
        <Card 
          key={biomarker.id} 
          className={`overflow-hidden cursor-pointer ${selectedType === biomarker.type ? 'ring-2 ring-primary' : ''}`}
          onClick={() => setSelectedType(selectedType === biomarker.type ? null : biomarker.type)}
        >
          <div className="p-3">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium">{biomarker.type} Level</p>
              <div className="flex items-center">
                <p className={`text-sm font-semibold ${getValueColor(biomarker.value, biomarker.normalRangeLow, biomarker.normalRangeHigh)}`}>
                  {biomarker.value.toFixed(1)} {biomarker.unit}
                </p>
                {getTrendIcon(biomarker.trend || 'stable')}
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${
                  biomarker.value > (biomarker.normalRangeHigh || 0) ? 'bg-red-500' :
                  biomarker.value < (biomarker.normalRangeLow || 0) ? 'bg-amber-500' :
                  'bg-green-500'
                }`} 
                style={{ 
                  width: `${getProgressPercentage(
                    biomarker.value, 
                    biomarker.normalRangeLow, 
                    biomarker.normalRangeHigh
                  )}%` 
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{biomarker.normalRangeLow?.toFixed(1) || '0'}</span>
              <span>Normal: {biomarker.normalRangeLow?.toFixed(1) || '0'}-{biomarker.normalRangeHigh?.toFixed(1) || '10'}</span>
              <span>{biomarker.normalRangeHigh?.toFixed(1) || '10+'}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
