import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock } from "lucide-react";
import { DashboardData } from "../types/cafe";
import { format, parseISO, differenceInHours, parseISO as parse } from "date-fns";

interface AttendanceSectionProps {
  data: DashboardData;
}

export const AttendanceSection = ({ data }: AttendanceSectionProps) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const todayAttendance = data.attendance.filter(att => att.date === today);

  const calculateHours = (timeIn: string, timeOut: string) => {
    if (!timeIn || !timeOut) return 0;
    
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const inTime = parse(`${today}T${timeIn}:00`);
      const outTime = parse(`${today}T${timeOut}:00`);
      return Math.max(0, differenceInHours(outTime, inTime));
    } catch {
      return 0;
    }
  };

  const getHoursBadge = (hours: number) => {
    if (hours === 0) {
      return { variant: "secondary" as const, text: "Active", color: "text-muted-foreground" };
    } else if (hours < 6) {
      return { variant: "destructive" as const, text: `${hours}h`, color: "text-destructive" };
    } else if (hours >= 8) {
      return { variant: "default" as const, text: `${hours}h`, color: "text-success" };
    } else {
      return { variant: "secondary" as const, text: `${hours}h`, color: "text-foreground" };
    }
  };

  const formatTime = (time: string) => {
    if (!time) return '-';
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return time;
    }
  };

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Users className="h-5 w-5" />
          Today's Attendance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Staff Name</th>
                <th className="text-center py-3 text-sm font-medium text-muted-foreground">Time In</th>
                <th className="text-center py-3 text-sm font-medium text-muted-foreground">Time Out</th>
                <th className="text-center py-3 text-sm font-medium text-muted-foreground">Total Hours</th>
                <th className="text-center py-3 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {todayAttendance.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-muted-foreground">
                    No attendance data for today
                  </td>
                </tr>
              ) : (
                todayAttendance.map((attendance, index) => {
                  const hours = calculateHours(attendance.timeIn, attendance.timeOut);
                  const badge = getHoursBadge(hours);
                  
                  return (
                    <tr 
                      key={`${attendance.staffName}-${attendance.date}`}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="py-3 text-sm font-medium capitalize">
                        {attendance.staffName}
                      </td>
                      <td className="py-3 text-sm text-center">
                        {formatTime(attendance.timeIn)}
                      </td>
                      <td className="py-3 text-sm text-center">
                        {attendance.timeOut ? formatTime(attendance.timeOut) : (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="mr-1 h-3 w-3" />
                            Working
                          </Badge>
                        )}
                      </td>
                      <td className={`py-3 text-sm text-center font-medium ${badge.color}`}>
                        {hours > 0 ? `${hours}h` : '-'}
                      </td>
                      <td className="py-3 text-center">
                        <Badge 
                          variant={badge.variant}
                          className={`
                            ${badge.variant === 'default' && hours >= 8 ? 'bg-success text-success-foreground' : ''}
                          `}
                        >
                          {hours === 0 ? "Active" : 
                           hours < 6 ? "Short" :
                           hours >= 8 ? "Complete" : "Partial"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-sm text-muted-foreground">Present Today</div>
            <div className="text-2xl font-bold text-primary">{todayAttendance.length}</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-sm text-muted-foreground">Currently Working</div>
            <div className="text-2xl font-bold text-success">
              {todayAttendance.filter(att => att.timeIn && !att.timeOut).length}
            </div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-sm text-muted-foreground">Completed Shifts</div>
            <div className="text-2xl font-bold text-foreground">
              {todayAttendance.filter(att => calculateHours(att.timeIn, att.timeOut) >= 8).length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};