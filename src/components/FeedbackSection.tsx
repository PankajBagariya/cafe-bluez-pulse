import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DashboardData } from "../types/cafe";

interface FeedbackSectionProps {
  data: DashboardData;
}

export const FeedbackSection = ({ data }: FeedbackSectionProps) => {
  // Get latest 5 reviews
  const latestFeedback = data.feedback
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Calculate rating distribution
  const ratingCounts = data.feedback.reduce((acc, feedback) => {
    acc[feedback.rating] = (acc[feedback.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const ratingData = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: ratingCounts[rating] || 0,
    percentage: data.feedback.length > 0 
      ? Math.round(((ratingCounts[rating] || 0) / data.feedback.length) * 100)
      : 0
  }));

  const COLORS = {
    5: 'hsl(var(--chart-2))', // Green
    4: 'hsl(var(--chart-1))', // Yellow
    3: 'hsl(var(--chart-3))', // Blue
    2: 'hsl(var(--chart-4))', // Purple
    1: 'hsl(var(--chart-5))'  // Red
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'fill-muted text-muted-foreground'
        }`}
      />
    ));
  };

  const getFeedbackBadge = (rating: number) => {
    if (rating <= 2) {
      return { variant: "destructive" as const, text: "Poor" };
    } else if (rating === 3) {
      return { variant: "secondary" as const, text: "Average" };
    } else if (rating === 4) {
      return { variant: "default" as const, text: "Good" };
    } else {
      return { variant: "default" as const, text: "Excellent" };
    }
  };

  const averageRating = data.feedback.length > 0 
    ? (data.feedback.reduce((sum, f) => sum + f.rating, 0) / data.feedback.length).toFixed(1)
    : '0.0';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">
            {data.rating} Star{data.rating !== 1 ? 's' : ''}
          </p>
          <p className="text-sm text-muted-foreground">
            {data.count} review{data.count !== 1 ? 's' : ''} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Feedback */}
      <Card className="bg-card border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <MessageSquare className="h-5 w-5" />
            Recent Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {latestFeedback.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No feedback available
              </div>
            ) : (
              latestFeedback.map((feedback, index) => {
                const badge = getFeedbackBadge(feedback.rating);
                return (
                  <div 
                    key={`${feedback.date}-${index}`}
                    className={`
                      p-4 rounded-lg border border-border/50 animate-fade-in
                      ${feedback.rating <= 3 ? 'bg-destructive/5 border-destructive/20' : 'bg-muted/30'}
                    `}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {renderStars(feedback.rating)}
                        </div>
                        <Badge variant={badge.variant} className="text-xs">
                          {badge.text}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {feedback.date}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">
                      {feedback.feedback}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rating Distribution */}
      <Card className="bg-card border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Star className="h-5 w-5" />
            Rating Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-primary mb-2">
              {averageRating}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(parseFloat(averageRating)))}
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {data.feedback.length} review{data.feedback.length !== 1 ? 's' : ''}
            </p>
          </div>

          {data.feedback.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={ratingData.filter(d => d.count > 0)}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ rating, percentage }) => `${rating}★ (${percentage}%)`}
                  >
                    {ratingData.filter(d => d.count > 0).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.rating as keyof typeof COLORS]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-4 space-y-2">
                {ratingData.reverse().map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: COLORS[rating as keyof typeof COLORS] }} />
                      <span>{rating} Star{rating !== 1 ? 's' : ''}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {count} ({percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No ratings to display
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};