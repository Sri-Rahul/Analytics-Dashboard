"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  MetricCardSkeleton, 
  ChartSkeleton, 
  TableSkeleton, 
  DashboardSkeleton,
  LoadingWrapper 
} from "./LoadingSkeleton";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DollarSign, Users, TrendingUp, Activity } from "lucide-react";

export function SkeletonDemo() {
  const [isLoading, setIsLoading] = useState(true);

  const toggleLoading = () => {
    setIsLoading(!isLoading);
  };

  const mockMetrics = [
    {
      title: "Total Revenue",
      value: 45231,
      change: 20.1,
      changeType: "positive" as const,
      icon: DollarSign,
      format: "currency" as const
    },
    {
      title: "Active Users",
      value: 2350,
      change: 7.8,
      changeType: "positive" as const,
      icon: Users
    },
    {
      title: "Conversion Rate",
      value: 12.5,
      change: -2.1,
      changeType: "negative" as const,
      icon: TrendingUp,
      format: "percentage" as const
    },
    {
      title: "Growth Rate",
      value: 573,
      change: 17.2,
      changeType: "positive" as const,
      icon: Activity
    }
  ];

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Loading Skeleton Demo</h1>
          <p className="text-muted-foreground">
            Showcase of loading states with smooth transitions
          </p>
        </div>
        <Button onClick={toggleLoading}>
          {isLoading ? "Show Content" : "Show Loading"}
        </Button>
      </div>

      {/* Individual Skeleton Components */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Individual Components</h2>
        
        {/* Metric Cards */}
        <div>
          <h3 className="text-lg font-medium mb-4">Metric Cards</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mockMetrics.map((metric, index) => (
              <LoadingWrapper
                key={index}
                isLoading={isLoading}
                skeleton={<MetricCardSkeleton />}
              >
                <MetricCard {...metric} />
              </LoadingWrapper>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div>
          <h3 className="text-lg font-medium mb-4">Charts</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <LoadingWrapper
              isLoading={isLoading}
              skeleton={<ChartSkeleton type="line" />}
            >
              <div className="rounded-lg border bg-card p-6">
                <h4 className="text-lg font-semibold mb-4">Line Chart</h4>
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                  Chart content would go here
                </div>
              </div>
            </LoadingWrapper>
            
            <LoadingWrapper
              isLoading={isLoading}
              skeleton={<ChartSkeleton type="bar" />}
            >
              <div className="rounded-lg border bg-card p-6">
                <h4 className="text-lg font-semibold mb-4">Bar Chart</h4>
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                  Chart content would go here
                </div>
              </div>
            </LoadingWrapper>
            
            <LoadingWrapper
              isLoading={isLoading}
              skeleton={<ChartSkeleton type="pie" />}
            >
              <div className="rounded-lg border bg-card p-6">
                <h4 className="text-lg font-semibold mb-4">Pie Chart</h4>
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                  Chart content would go here
                </div>
              </div>
            </LoadingWrapper>
          </div>
        </div>

        {/* Table */}
        <div>
          <h3 className="text-lg font-medium mb-4">Data Table</h3>
          <LoadingWrapper
            isLoading={isLoading}
            skeleton={<TableSkeleton />}
          >
            <div className="rounded-lg border bg-card p-6">
              <h4 className="text-lg font-semibold mb-4">Campaign Performance</h4>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Table content would go here
              </div>
            </div>
          </LoadingWrapper>
        </div>
      </div>

      {/* Full Dashboard Skeleton */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Complete Dashboard</h2>
        <LoadingWrapper
          isLoading={isLoading}
          skeleton={<DashboardSkeleton />}
        >
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back! Here's what's happening with your campaigns.
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">Export</Button>
                <Button>Refresh</Button>
              </div>
            </div>
            
            {/* Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {mockMetrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>
            
            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Line chart content
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Campaign Performance</h3>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Bar chart content
                </div>
              </div>
            </div>
            
            {/* Table */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Campaigns</h3>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Data table content
              </div>
            </div>
          </div>
        </LoadingWrapper>
      </div>
    </div>
  );
}