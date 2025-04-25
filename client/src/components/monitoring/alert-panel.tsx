import { Alert as AlertType } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertTriangle,
  Clock,
  Check,
  BellOff
} from "@/lib/icons";
import { Badge } from "@/components/ui/badge";

interface AlertPanelProps {
  alerts: AlertType[] | undefined;
  isLoading: boolean;
  onAcknowledge: (id: number) => void;
}

export default function AlertPanel({ 
  alerts, 
  isLoading, 
  onAcknowledge 
}: AlertPanelProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  // Get alert severity class
  const getAlertSeverityClass = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return "bg-red-500";
      case 'medium':
        return "bg-amber-500";
      case 'low':
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patient Alerts</CardTitle>
          <CardDescription>
            Critical notifications requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter unacknowledged alerts first
  const activeAlerts = alerts?.filter(alert => !alert.acknowledged) || [];
  const acknowledgedAlerts = alerts?.filter(alert => alert.acknowledged) || [];

  // Sort by date, newest first
  const sortedActiveAlerts = [...activeAlerts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const sortedAcknowledgedAlerts = [...acknowledgedAlerts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Patient Alerts
            </CardTitle>
            <CardDescription>
              Critical notifications requiring attention
            </CardDescription>
          </div>
          <Badge variant={activeAlerts.length > 0 ? "destructive" : "outline"}>
            {activeAlerts.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {sortedActiveAlerts.length === 0 && sortedAcknowledgedAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <BellOff className="h-12 w-12 mb-2 text-muted-foreground/50" />
            <p>No alerts to display</p>
            <p className="text-xs text-center max-w-[240px] mt-1">
              Patient is not currently generating any monitoring alerts
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {sortedActiveAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className="relative p-3 border rounded-lg border-destructive/50 bg-destructive/5 mb-3"
              >
                <div className="flex items-center mb-1">
                  <span className={`h-2 w-2 rounded-full mr-2 ${getAlertSeverityClass(alert.severity)}`}></span>
                  <span className="font-medium">{alert.title}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {alert.message}
                </p>
                <div className="flex justify-between items-center">
                  <span className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(alert.createdAt)}
                  </span>
                  <Button 
                    size="sm" 
                    onClick={() => onAcknowledge(alert.id)}
                    variant="outline"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Acknowledge
                  </Button>
                </div>
              </div>
            ))}
            
            {sortedAcknowledgedAlerts.length > 0 && (
              <>
                <div className="text-xs font-medium text-muted-foreground mt-4 mb-2">
                  ACKNOWLEDGED ALERTS
                </div>
                {sortedAcknowledgedAlerts.slice(0, 3).map((alert) => (
                  <div 
                    key={alert.id} 
                    className="relative p-3 border rounded-lg border-border bg-muted/50 mb-2"
                  >
                    <div className="flex items-center mb-1">
                      <span className={`h-2 w-2 rounded-full mr-2 ${getAlertSeverityClass(alert.severity)}`}></span>
                      <span className="font-medium">{alert.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {alert.message}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(alert.createdAt)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        Acknowledged
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {sortedAcknowledgedAlerts.length > 3 && (
                  <Button 
                    variant="ghost" 
                    className="w-full mt-2 h-8 text-xs"
                    size="sm"
                  >
                    View {sortedAcknowledgedAlerts.length - 3} more acknowledged alerts
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}