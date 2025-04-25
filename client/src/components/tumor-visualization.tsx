import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Scan } from "@shared/schema";
import { Loader2, Plus, Minus, RotateCcw, Eye, Maximize } from "lucide-react";
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveHeatMap } from '@nivo/heatmap';

interface TumorVisualizationProps {
  patientId: string;
  scanId?: number | null;
}

export default function TumorVisualization({ patientId, scanId }: TumorVisualizationProps) {
  const [selectedScanId, setSelectedScanId] = useState<number | null>(scanId || null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Fetch scans for patient
  const { data: scans, isLoading } = useQuery<Scan[]>({
    queryKey: [`/api/patients/${patientId}/scans`],
    enabled: !!patientId,
  });

  // Update selected scan when scanId prop changes
  useEffect(() => {
    if (scanId !== undefined) {
      setSelectedScanId(scanId);
    } else if (scans && scans.length > 0 && selectedScanId === null) {
      setSelectedScanId(scans[0].id);
    }
  }, [scanId, scans, selectedScanId]);

  const selectedScan = selectedScanId ? scans?.find(scan => scan.id === selectedScanId) : scans?.[0];

  // Sample data for visualizations
  const malignancyData = [
    {
      id: "Malignant",
      label: "Malignant",
      value: selectedScan?.malignancyScore ? Math.round(selectedScan.malignancyScore * 100) : 83,
      color: "hsl(10, 70%, 50%)"
    },
    {
      id: "Benign",
      label: "Benign",
      value: selectedScan?.malignancyScore ? Math.round((1 - selectedScan.malignancyScore) * 100) : 17,
      color: "hsl(120, 70%, 50%)"
    }
  ];

  const tumorGrowthData = [
    {
      id: "tumor",
      color: "hsl(291, 70%, 50%)",
      data: [
        { x: "Jan", y: 1.8 },
        { x: "Feb", y: 2.2 },
        { x: "Mar", y: 2.5 },
        { x: "Apr", y: selectedScan?.tumorSize || 2.7 }
      ]
    }
  ];

  const tissueDistributionData = [
    { name: "Central", tumor: 67, healthy: 33 },
    { name: "Peripheral", tumor: 28, healthy: 72 },
    { name: "Adjacent", tumor: 12, healthy: 88 }
  ];

  const densityMapData = [
    { id: "Sector 1", data: [
      { x: "A", y: 7 },
      { x: "B", y: 5 },
      { x: "C", y: 3 },
      { x: "D", y: 2 }
    ]},
    { id: "Sector 2", data: [
      { x: "A", y: 3 },
      { x: "B", y: 8 },
      { x: "C", y: 6 },
      { x: "D", y: 4 }
    ]},
    { id: "Sector 3", data: [
      { x: "A", y: 2 },
      { x: "B", y: 4 },
      { x: "C", y: 9 },
      { x: "D", y: 5 }
    ]},
    { id: "Sector 4", data: [
      { x: "A", y: 1 },
      { x: "B", y: 3 },
      { x: "C", y: 4 },
      { x: "D", y: 7 }
    ]}
  ];

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Card className={`lg:col-span-3 overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between p-5 border-b border-border">
        <div>
          <CardTitle>Tumor Visualization</CardTitle>
          <CardDescription>
            {selectedScan ? `${selectedScan.scanType} scan - ${new Date(selectedScan.uploadedAt).toLocaleDateString()}` : 'Select a scan'}
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          {scanId === undefined && scans && scans.length > 0 && (
            <Select 
              value={selectedScanId ? String(selectedScanId) : ''} 
              onValueChange={(value) => setSelectedScanId(Number(value))}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select scan" />
              </SelectTrigger>
              <SelectContent>
                {scans.map((scan) => (
                  <SelectItem key={scan.id} value={String(scan.id)}>
                    {scan.scanType} - {new Date(scan.uploadedAt).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            <Maximize className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </CardHeader>
      
      <div className="flex flex-col md:flex-row h-full">
        {/* 3D Visualization */}
        <div className="w-full md:w-2/3 p-4 h-96 relative">
          {isLoading ? (
            <Skeleton className="w-full h-full rounded-lg" />
          ) : selectedScan ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              <div className="h-full flex items-center justify-center bg-muted rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="3D tumor visualization" 
                  className="w-full h-full object-cover" 
                  style={{ 
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    transition: 'transform 0.3s ease'
                  }}
                />
              </div>
              <div className="h-full flex flex-col">
                <div className="p-2 bg-muted rounded-lg mb-2">
                  <h3 className="text-sm font-medium mb-1">Tumor Density Map</h3>
                  <div className="h-[140px]">
                    <ResponsiveHeatMap
                      data={densityMapData}
                      margin={{ top: 0, right: 0, bottom: 10, left: 10 }}
                      valueFormat=">-.2s"
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: '',
                        legendPosition: 'middle',
                        legendOffset: 36
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: '',
                        legendPosition: 'middle',
                        legendOffset: -40
                      }}
                      colors={{
                        type: 'sequential',
                        scheme: 'reds',
                      }}
                      emptyColor="#555555"
                      borderColor="#ffffff"
                      labelTextColor="#ffffff"
                      enableLabels={false}
                      hoverTarget="cell"
                      cellBorderWidth={1}
                      cellBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
                      theme={{
                        axis: {
                          ticks: {
                            text: {
                              fontSize: 8,
                              fill: '#888888',
                            }
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1 bg-muted rounded-lg p-2">
                  <h3 className="text-sm font-medium mb-1">Quantum-Enhanced Analysis</h3>
                  <div className="text-xs space-y-1">
                    <p><span className="font-medium">Resolution:</span> 0.5mm voxel precision</p>
                    <p><span className="font-medium">Model:</span> Quantum ML Segmentation v3.2</p>
                    <p><span className="font-medium">Processing time:</span> 3.4 seconds</p>
                    <p><span className="font-medium">Confidence:</span> 97.8% tumor boundary</p>
                    <p><span className="font-medium">Quantum advantage:</span> 48x faster analysis</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">No scan selected or available</p>
            </div>
          )}
          
          {selectedScan && (
            <div className="absolute bottom-6 left-6 right-6 flex justify-between">
              <div className="bg-white/90 dark:bg-background/90 backdrop-blur-sm rounded-lg shadow-sm px-3 py-2 flex items-center space-x-3">
                <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleRotate}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-white/90 dark:bg-background/90 backdrop-blur-sm rounded-lg shadow-sm flex items-center px-3 py-2">
                <Select defaultValue={selectedScan.scanType}>
                  <SelectTrigger className="border-0 bg-transparent focus:ring-0 p-0 h-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CT">CT Scan</SelectItem>
                    <SelectItem value="MRI">MRI</SelectItem>
                    <SelectItem value="PET">PET Scan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        
        {/* Tumor Analysis */}
        <div className="w-full md:w-1/3 border-t md:border-t-0 md:border-l border-border p-4 flex flex-col">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : selectedScan ? (
            <>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Detection Summary</h4>
                <div className="bg-muted rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Tumor Size</p>
                        <p className="text-sm font-semibold">{selectedScan.tumorSize || '2.7'} cm</p>
                      </div>
                      <div className="h-32">
                        <ResponsiveLine
                          data={tumorGrowthData}
                          margin={{ top: 10, right: 10, bottom: 30, left: 30 }}
                          xScale={{ type: 'point' }}
                          yScale={{ type: 'linear', min: 1, max: 4 }}
                          axisBottom={{
                            tickSize: 0,
                            tickPadding: 10,
                          }}
                          axisLeft={{
                            tickSize: 0,
                            tickValues: 3,
                            tickPadding: 5,
                            format: v => `${v}cm`,
                          }}
                          enableGridX={false}
                          enableGridY={false}
                          pointSize={8}
                          pointColor={{ theme: 'background' }}
                          pointBorderWidth={2}
                          pointBorderColor={{ from: 'serieColor' }}
                          pointLabelYOffset={-12}
                          enableArea={true}
                          areaOpacity={0.15}
                          useMesh={true}
                          enableSlices="x"
                          colors={{ scheme: 'category10' }}
                          theme={{
                            axis: {
                              ticks: {
                                text: {
                                  fontSize: 10,
                                  fill: '#888888',
                                }
                              },
                            },
                            grid: {
                              line: {
                                stroke: '#dddddd',
                                strokeWidth: 1,
                              },
                            },
                            crosshair: {
                              line: {
                                stroke: '#888888',
                                strokeWidth: 1,
                                strokeOpacity: 0.5,
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1 text-center">Malignancy Probability</p>
                      <div className="h-36">
                        <ResponsivePie
                          data={malignancyData}
                          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                          innerRadius={0.5}
                          padAngle={0.7}
                          cornerRadius={3}
                          activeOuterRadiusOffset={8}
                          colors={{ scheme: 'set1' }}
                          borderWidth={1}
                          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                          enableArcLinkLabels={false}
                          arcLabelsSkipAngle={10}
                          arcLabelsTextColor="#ffffff"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1 text-center">Tissue Distribution</p>
                      <div className="h-36">
                        <ResponsiveBar
                          data={tissueDistributionData}
                          keys={['tumor', 'healthy']}
                          indexBy="name"
                          margin={{ top: 0, right: 0, bottom: 15, left: 0 }}
                          padding={0.3}
                          groupMode="stacked"
                          valueScale={{ type: 'linear' }}
                          indexScale={{ type: 'band', round: true }}
                          colors={['#ef4444', '#22c55e']}
                          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                          axisTop={null}
                          axisRight={null}
                          axisBottom={{
                            tickSize: 0,
                            tickPadding: 5,
                            tickRotation: -45,
                          }}
                          axisLeft={null}
                          labelSkipWidth={12}
                          labelSkipHeight={12}
                          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                          animate={true}
                          enableLabel={false}
                          theme={{
                            axis: {
                              ticks: {
                                text: {
                                  fontSize: 8,
                                  fill: '#888888',
                                }
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Diagnostic Insights</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center p-2 rounded-lg bg-muted">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2"></div>
                    <p>Irregular border detected in right lobe</p>
                  </div>
                  <div className="flex items-center p-2 rounded-lg bg-muted">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2"></div>
                    <p>Potential lymph node involvement - 2 nodes</p>
                  </div>
                  <div className="flex items-center p-2 rounded-lg bg-muted">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                    <p>Previous scan comparison shows 8% growth</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto pt-4">
                <Button className="w-full">
                  Full Analysis Report
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-10 w-10 mb-4 animate-spin opacity-30" />
              <p>Select a scan to view tumor analysis</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
