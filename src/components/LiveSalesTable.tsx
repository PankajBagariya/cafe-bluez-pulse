import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { DashboardData } from "../types/cafe";

interface LiveSalesTableProps {
  data: DashboardData;
}

export const LiveSalesTable = ({ data }: LiveSalesTableProps) => {
  // Get latest 10 transactions, sorted by date and time
  const latestSales = data.salesLog
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 10);

  const getPaymentBadge = (paymentType: string) => {
    return paymentType === 'UPI' ? (
      <Badge variant="default" className="bg-success text-success-foreground">
        UPI
      </Badge>
    ) : (
      <Badge variant="destructive">Cash</Badge>
    );
  };

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Clock className="h-5 w-5" />
          Live Sales (Latest 10)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Time</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Item</th>
                <th className="text-center py-3 text-sm font-medium text-muted-foreground">Qty</th>
                <th className="text-right py-3 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-center py-3 text-sm font-medium text-muted-foreground">Payment</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Staff</th>
              </tr>
            </thead>
            <tbody>
              {latestSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    No sales data available
                  </td>
                </tr>
              ) : (
                latestSales.map((sale, index) => (
                  <tr 
                    key={`${sale.date}-${sale.time}-${index}`}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="py-3 text-sm">{sale.date}</td>
                    <td className="py-3 text-sm">{sale.time}</td>
                    <td className="py-3 text-sm font-medium">{sale.itemName}</td>
                    <td className="py-3 text-sm text-center">{sale.quantity}</td>
                    <td className="py-3 text-sm text-right font-medium text-primary">
                      ₹{(sale.price * sale.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 text-center">
                      {getPaymentBadge(sale.paymentType)}
                    </td>
                    <td className="py-3 text-sm capitalize">{sale.staffName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};