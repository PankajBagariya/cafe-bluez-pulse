import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Package, Users, AlertTriangle } from "lucide-react";
import { DashboardData } from "../types/cafe";
import { format } from "date-fns";

interface SummaryCardsProps {
  data: DashboardData;
}

export const SummaryCards = ({ data }: SummaryCardsProps) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Calculate today's sales
  const todaySales = data.salesLog
    .filter(sale => sale.date === today)
    .reduce((total, sale) => total + (sale.price * sale.quantity), 0);
  
  // Calculate items sold today
  const itemsSold = data.salesLog
    .filter(sale => sale.date === today)
    .reduce((total, sale) => total + sale.quantity, 0);
  
  // Count staff present today
  const staffPresent = data.attendance
    .filter(att => att.date === today && att.timeIn)
    .length;
  
  // Count low stock items
  const lowStockItems = data.inventory
    .filter(item => item.stockLeft <= item.reorderThreshold)
    .length;

  const cards = [
    {
      title: "Today's Sales",
      value: `₹${todaySales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      variant: "default" as const,
      description: "Total revenue today"
    },
    {
      title: "Items Sold",
      value: itemsSold.toString(),
      icon: Package,
      variant: "default" as const,
      description: "Products sold today"
    },
    {
      title: "Staff Present",
      value: staffPresent.toString(),
      icon: Users,
      variant: "default" as const,
      description: "Active staff members"
    },
    {
      title: "Low Stock Alerts",
      value: lowStockItems.toString(),
      icon: AlertTriangle,
      variant: lowStockItems > 0 ? "destructive" as const : "default" as const,
      description: "Items need reorder"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card 
          key={card.title}
          className={`
            bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 
            animate-fade-in
            ${card.variant === 'destructive' ? 'ring-2 ring-destructive/20 animate-pulse-glow' : ''}
          `}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`
              h-5 w-5 
              ${card.variant === 'destructive' ? 'text-destructive' : 'text-primary'}
            `} />
          </CardHeader>
          <CardContent>
            <div className={`
              text-2xl font-bold mb-1
              ${card.variant === 'destructive' ? 'text-destructive' : 'text-primary'}
            `}>
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
            {card.variant === 'destructive' && lowStockItems > 0 && (
              <Badge variant="destructive" className="mt-2 text-xs">
                Immediate Action Required
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};