import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, BarChart3 } from "lucide-react";
import { DashboardData } from "../types/cafe";
import { format, subDays, parseISO } from "date-fns";

interface SalesChartProps {
  data: DashboardData;
}

export const SalesChart = ({ data }: SalesChartProps) => {
  // Generate last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayName = format(date, 'EEE');
    
    const dayTotal = data.salesLog
      .filter(sale => sale.date === dateStr)
      .reduce((total, sale) => total + (sale.price * sale.quantity), 0);
    
    return {
      date: dateStr,
      day: dayName,
      total: dayTotal
    };
  });

  // Get top 3 items by quantity sold
  const itemSales = data.salesLog.reduce((acc, sale) => {
    acc[sale.itemName] = (acc[sale.itemName] || 0) + sale.quantity;
    return acc;
  }, {} as Record<string, number>);

  const top3Items = Object.entries(itemSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([itemName, quantity]) => ({ itemName, quantity }));

  // Generate trend data for top 3 items over last 7 days
  const itemTrendData = last7Days.map(day => {
    const dayData: any = { date: day.day };
    
    top3Items.forEach(item => {
      const dayQuantity = data.salesLog
        .filter(sale => sale.date === day.date && sale.itemName === item.itemName)
        .reduce((total, sale) => total + sale.quantity, 0);
      dayData[item.itemName] = dayQuantity;
    });
    
    return dayData;
  });

  const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'total' ? (
                `Total: ₹${entry.value.toLocaleString('en-IN')}`
              ) : (
                `${entry.dataKey}: ${entry.value} items`
              )}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Daily Sales Bar Chart */}
      <Card className="bg-card border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <BarChart3 className="h-5 w-5" />
            Daily Sales (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="total" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Items Trend Line Chart */}
      <Card className="bg-card border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <TrendingUp className="h-5 w-5" />
            Top 3 Items Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={itemTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              {top3Items.map((item, index) => (
                <Line
                  key={item.itemName}
                  type="monotone"
                  dataKey={item.itemName}
                  stroke={colors[index]}
                  strokeWidth={3}
                  dot={{ fill: colors[index], strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: colors[index], strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          {top3Items.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {top3Items.map((item, index) => (
                <div key={item.itemName} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[index] }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.itemName} ({item.quantity})
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};