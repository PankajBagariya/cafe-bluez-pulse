import { Badge } from "@/components/ui/badge";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";

interface DashboardHeaderProps {
  lastUpdated: Date;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export const DashboardHeader = ({ lastUpdated, isLoading, error, onRefresh }: DashboardHeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(60);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const secondsSinceUpdate = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      const remaining = Math.max(0, 60 - secondsSinceUpdate);
      setTimeUntilRefresh(remaining);
    }, 1000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  const formatIST = (date: Date) => {
    return format(date, 'PPP p') + ' IST';
  };

  return (
    <div className="mb-8">
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2 animate-fade-in">
            Cafe Bluez Dashboard
          </h1>
          <p className="text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: '100ms' }}>
            Real-time Business Intelligence
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Current Time</div>
            <div className="text-lg font-mono font-medium text-primary">
              {format(currentTime, 'HH:mm:ss')}
            </div>
            <div className="text-xs text-muted-foreground">
              {format(currentTime, 'dd MMM yyyy')} IST
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-card rounded-lg border border-border shadow-sm">
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            {error ? (
              <>
                <WifiOff className="h-4 w-4 text-destructive" />
                <Badge variant="destructive" className="text-xs">
                  Connection Error
                </Badge>
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 text-success" />
                <Badge variant="default" className="bg-success text-success-foreground text-xs">
                  Connected
                </Badge>
              </>
            )}
          </div>

          {/* Last Updated */}
          <div className="text-sm text-muted-foreground">
            Last updated: {format(lastUpdated, 'HH:mm:ss')}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Auto-refresh countdown */}
          <div className="text-sm text-muted-foreground">
            Next refresh in: <span className="font-mono font-medium text-primary">
              {Math.floor(timeUntilRefresh / 60)}:{(timeUntilRefresh % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Manual refresh button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
              transition-all duration-200 border border-border
              ${isLoading 
                ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                : 'bg-background hover:bg-muted text-foreground hover:border-primary'
              }
            `}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Updating...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-fade-in">
          <div className="flex items-center gap-2 text-destructive text-sm">
            <WifiOff className="h-4 w-4" />
            <span className="font-medium">{error}</span>
          </div>
          <p className="text-xs text-destructive/80 mt-1">
            Showing cached data. Check your internet connection and try refreshing.
          </p>
        </div>
      )}
    </div>
  );
};