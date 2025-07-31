import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardData } from "../types/cafe";
import { useState } from "react";

interface InventorySectionProps {
  data: DashboardData;
}

export const InventorySection = ({ data }: InventorySectionProps) => {
  const [sortBy, setSortBy] = useState<'name' | 'stock'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedInventory = [...data.inventory].sort((a, b) => {
    if (sortBy === 'name') {
      const comparison = a.itemName.localeCompare(b.itemName);
      return sortOrder === 'asc' ? comparison : -comparison;
    } else {
      const comparison = a.stockLeft - b.stockLeft;
      return sortOrder === 'asc' ? comparison : -comparison;
    }
  });

  const toggleSort = (field: 'name' | 'stock') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getStockStatus = (item: typeof data.inventory[0]) => {
    if (item.stockLeft <= item.reorderThreshold) {
      return {
        variant: "destructive" as const,
        text: "Low Stock",
        className: "animate-pulse-glow"
      };
    } else if (item.stockLeft <= item.reorderThreshold * 1.5) {
      return {
        variant: "warning" as const,
        text: "Medium",
        className: ""
      };
    } else {
      return {
        variant: "default" as const,
        text: "Good",
        className: ""
      };
    }
  };

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Package className="h-5 w-5" />
          Inventory Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort('name')}
                    className="flex items-center gap-1 -ml-3 text-muted-foreground hover:text-foreground"
                  >
                    Item Name
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </th>
                <th className="text-center py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort('stock')}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    Stock Left
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </th>
                <th className="text-center py-3 text-sm font-medium text-muted-foreground">
                  Threshold
                </th>
                <th className="text-center py-3 text-sm font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedInventory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-muted-foreground">
                    No inventory data available
                  </td>
                </tr>
              ) : (
                sortedInventory.map((item, index) => {
                  const status = getStockStatus(item);
                  return (
                    <tr 
                      key={item.itemName}
                      className={`
                        border-b border-border/50 hover:bg-muted/30 transition-colors animate-fade-in
                        ${status.className}
                      `}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="py-3 text-sm font-medium">{item.itemName}</td>
                      <td className={`
                        py-3 text-sm text-center font-medium
                        ${item.stockLeft <= item.reorderThreshold ? 'text-destructive' : 'text-foreground'}
                      `}>
                        {item.stockLeft}
                      </td>
                      <td className="py-3 text-sm text-center text-muted-foreground">
                        {item.reorderThreshold}
                      </td>
                      <td className="py-3 text-center">
                        <Badge 
                          variant={status.variant === 'warning' ? 'secondary' : status.variant}
                          className={`
                            ${status.variant === 'warning' ? 'bg-warning text-warning-foreground' : ''}
                            ${status.className}
                          `}
                        >
                          {status.text}
                          {item.stockLeft <= item.reorderThreshold && (
                            <AlertTriangle className="ml-1 h-3 w-3" />
                          )}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {data.inventory.filter(item => item.stockLeft <= item.reorderThreshold).length > 0 && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">
                {data.inventory.filter(item => item.stockLeft <= item.reorderThreshold).length} item(s) need immediate reordering
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};