"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { ResponsiveContainer, ResponsiveGrid, MobileFirstSection } from "@/components/layout/responsive-container";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/components/animations/LoadingSkeleton";
import { generatePieChartData } from "@/lib/data";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DataFreshnessIndicator } from "@/components/dashboard/DataFreshnessIndicator";
import Particles from "@/components/ui/particles";
import { 
  LazyLineChart, 
  LazyBarChart, 
  LazyPieChart 
} from "@/components/dashboard/LazyCharts";
import {
  LazyDateRangePickerDemo,
  LazyUnifiedFilteringDemo
} from "@/components/dashboard/LazyDemos";
import { useRealTimeData, useRealTimeChartData } from "@/hooks/useRealTimeData";
import { motion } from "motion/react";
import { DollarSign, Users, TrendingUp, Activity, RefreshCw } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { useKeyboardNavigation, keyboardUtils } from "@/hooks/useKeyboardNavigation";
import { ClientOnly } from "@/components/ui/client-only";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function Dashboard() {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  
  const { 
    metrics, 
    realtimeMetrics, 
    isRefreshing, 
    lastUpdated,
    startRealTimeUpdates,
    stopRealTimeUpdates,
    forceRefresh
  } = useRealTimeData({
    refreshInterval: 5000,
    autoStart: true,
    enableRealtime: isRealTimeEnabled
  });

  const lineChartData = useRealTimeChartData('line');
  const barChartData = useRealTimeChartData('bar');

  const toggleRealTime = useCallback(() => {
    if (isRealTimeEnabled) {
      stopRealTimeUpdates();
    } else {
      startRealTimeUpdates();
    }
    setIsRealTimeEnabled(!isRealTimeEnabled);
  }, [isRealTimeEnabled, stopRealTimeUpdates, startRealTimeUpdates]);

  // Define keyboard shortcuts with useMemo for performance
  const keyboardShortcuts = useMemo(() => [
    {
      key: "h",
      description: "Go to dashboard home",
      category: "Navigation",
      action: () => keyboardUtils.navigateToSection("main-content")
    },
    {
      key: "m",
      description: "Go to metrics section",
      category: "Navigation", 
      action: () => keyboardUtils.navigateToSection("metrics")
    },
    {
      key: "c",
      description: "Go to charts section",
      category: "Navigation",
      action: () => keyboardUtils.navigateToSection("charts")
    },
    {
      key: "r",
      description: "Toggle real-time updates",
      category: "Actions",
      action: toggleRealTime
    },
    {
      key: "f",
      description: "Force refresh data",
      category: "Actions", 
      action: forceRefresh
    },
    {
      key: "t",
      description: "Toggle theme",
      category: "Actions",
      action: () => {
        const themeToggle = document.querySelector('[aria-label*="Toggle theme"]') as HTMLButtonElement;
        if (themeToggle) themeToggle.click();
      }
    },
    {
      key: "/",
      description: "Focus search",
      category: "Actions",
      action: () => keyboardUtils.focusElement('input[type="search"], input[placeholder*="Search"]')
    }
  ], [toggleRealTime, forceRefresh]);

  // Enable keyboard navigation
  useKeyboardNavigation({ shortcuts: keyboardShortcuts });

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />
      
      {/* Subtle particles effect */}
      <Particles
        className="absolute inset-0"
        quantity={20}
        ease={80}
        color="#3b82f6"
        size={0.3}
        staticity={50}
        vx={0.1}
        vy={0.1}
      />
      
      {/* Main content */}
      <div className="relative z-10">
        <Header />
        <main role="main" aria-label="Analytics Dashboard" id="main-content">
        <ResponsiveContainer>
          <MobileFirstSection>
            <header className="flex flex-col space-y-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mt-12 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl relative group">
                  <span className="relative z-10">Analytics Dashboard</span>
                  <div className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 group-hover:opacity-40 transition-opacity duration-500"></div>
                </h1>
                <p className="text-base text-muted-foreground sm:text-lg max-w-2xl leading-relaxed">
                  Real-time insights and performance metrics to drive your business forward
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Button
                  onClick={forceRefresh}
                  disabled={isRefreshing}
                  size="lg"
                  className="relative bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''} transition-transform duration-200`} />
                  <span className="relative z-10 font-medium">Refresh Data</span>
                </Button>
              </motion.div>
            </header>
            
            {/* Data Freshness Indicator */}
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <DataFreshnessIndicator
                lastUpdated={lastUpdated}
                isRefreshing={isRefreshing}
                isRealTimeEnabled={isRealTimeEnabled}
                onToggleRealTime={toggleRealTime}
                onForceRefresh={forceRefresh}
                showControls={true}
              />
            </motion.div>
          </MobileFirstSection>

          {/* Real-time Metrics Cards */}
          <MobileFirstSection>
            <section aria-labelledby="metrics-heading" id="metrics">
              <h2 id="metrics-heading" className="sr-only">Key Performance Metrics</h2>
              <ErrorBoundary>
                <ClientOnly fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
                  ))}
                </div>}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <ResponsiveGrid 
                    cols={{ default: 1, sm: 2, lg: 4 }}
                    gap="lg"
                  >
                    {useMemo(() => [
                      {
                        title: "Total Revenue",
                        value: metrics.revenue.current,
                        change: metrics.revenue.change,
                        changeType: metrics.revenue.change >= 0 ? "positive" : "negative",
                        icon: DollarSign,
                        format: "currency",
                        delay: 0
                      },
                      {
                        title: "Active Users",
                        value: metrics.users.current,
                        change: metrics.users.change,
                        changeType: metrics.users.change >= 0 ? "positive" : "negative",
                        icon: Users,
                        format: "number",
                        delay: 0.1
                      },
                      {
                        title: "Conversion Rate",
                        value: metrics.conversions.current,
                        change: metrics.conversions.change,
                        changeType: metrics.conversions.change >= 0 ? "positive" : "negative",
                        icon: TrendingUp,
                        format: "percentage",
                        delay: 0.2
                      },
                      {
                        title: "Growth Rate",
                        value: metrics.growth.current,
                        change: metrics.growth.change,
                        changeType: metrics.growth.change >= 0 ? "positive" : "negative",
                        icon: Activity,
                        format: "number",
                        delay: 0.3
                      }
                    ], [metrics]).map((metric, index) => (
                      <motion.div
                        key={metric.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + metric.delay }}
                      >
                        <MetricCard
                          title={metric.title}
                          value={metric.value}
                          change={metric.change}
                          changeType={metric.changeType as "positive" | "negative"}
                          icon={metric.icon}
                          format={metric.format as "currency" | "number" | "percentage"}
                          lastUpdated={lastUpdated}
                          isRefreshing={isRefreshing}
                          isRealTimeEnabled={isRealTimeEnabled}
                          showDataStatus={true}
                        />
                      </motion.div>
                    ))}
                  </ResponsiveGrid>
                </motion.div>
                </ClientOnly>
              </ErrorBoundary>
            </section>
          </MobileFirstSection>

          {/* Enhanced Real-time Activity Bar */}
          <MobileFirstSection>
            <section aria-labelledby="realtime-heading">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card via-card to-muted/20">
                  {/* Professional Subtle Background Pattern */}
                  <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,hsl(var(--primary))_0%,transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,hsl(var(--secondary))_0%,transparent_50%)]" />
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  </div>
                  
                  <CardHeader className="relative border-b border-border/30 bg-card/80 backdrop-blur-sm">
                    <CardTitle className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-lg font-semibold">Real-time Activity</div>
                        <div className="text-xs text-muted-foreground font-normal">Live analytics dashboard</div>
                      </div>
                      <div className="ml-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-xs text-muted-foreground">Live</span>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="relative p-6">
                    <ErrorBoundary>
                      <ClientOnly fallback={<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="text-center">
                            <div className="h-8 bg-muted animate-pulse rounded mb-2" />
                            <div className="h-4 bg-muted animate-pulse rounded" />
                          </div>
                        ))}
                      </div>}>
                      {/* Professional Grid Layout */}
                      <ResponsiveGrid 
                        cols={{ default: 1, sm: 3 }}
                        gap="lg"
                        className="relative z-10"
                        aria-label="Real-time activity metrics"
                      >
                        {/* Page Views */}
                        <motion.div 
                          className="group relative p-4 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm hover:border-green-500/30 transition-all duration-300"
                          whileHover={{ scale: 1.02, y: -2 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500/80" />
                          <div className="flex flex-col items-center text-center space-y-2">
                            <div className="text-2xl font-bold text-green-600 tracking-tight sm:text-3xl">
                              {realtimeMetrics.pageViews.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Page Views</div>
                          </div>
                          <div className="absolute inset-0 rounded-xl bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>

                        {/* Bounce Rate */}
                        <motion.div 
                          className="group relative p-4 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm hover:border-orange-500/30 transition-all duration-300"
                          whileHover={{ scale: 1.02, y: -2 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500/80" />
                          <div className="flex flex-col items-center text-center space-y-2">
                            <div className="text-2xl font-bold text-orange-600 tracking-tight sm:text-3xl">
                              {realtimeMetrics.bounceRate}%
                            </div>
                            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Bounce Rate</div>
                          </div>
                          <div className="absolute inset-0 rounded-xl bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>

                        {/* Avg Session */}
                        <motion.div 
                          className="group relative p-4 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300"
                          whileHover={{ scale: 1.02, y: -2 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-500/80" />
                          <div className="flex flex-col items-center text-center space-y-2">
                            <div className="text-2xl font-bold text-purple-600 tracking-tight sm:text-3xl">
                              {Math.floor(realtimeMetrics.avgSessionDuration / 60)}m {realtimeMetrics.avgSessionDuration % 60}s
                            </div>
                            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Avg. Session</div>
                          </div>
                          <div className="absolute inset-0 rounded-xl bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>
                      </ResponsiveGrid>
                      </ClientOnly>
                    </ErrorBoundary>
                    
                    {/* Subtle Activity Lines */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500/20 via-orange-500/20 to-purple-500/20" />
                  </CardContent>
                </Card>
              </motion.div>
            </section>
          </MobileFirstSection>

          {/* Charts Section */}
          <MobileFirstSection>
            <section aria-labelledby="charts-heading" id="charts" className="mt-16">
              <motion.div 
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <h2 id="charts-heading" className="text-3xl font-bold text-foreground mb-3">
                  Performance Analytics
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Comprehensive insights across revenue trends, traffic sources, and monthly performance metrics
                </p>
              </motion.div>

              {/* Charts Grid - 2/3 + 1/3 Layout */}
              <ResponsiveGrid cols={{ default: 1, lg: 3 }} className="gap-8">
                {/* Line Chart - Revenue & Users Trend (Takes 2/3 width) */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.3 }}
                  className="lg:col-span-2"
                >
                  <Suspense fallback={<LoadingSkeleton variant="chart" height={350} />}>
                    <LazyLineChart
                      title="Revenue & Users Trend"
                      data={lineChartData.data}
                      height={350}
                      lastUpdated={lastUpdated}
                      isRefreshing={lineChartData.isLoading || isRefreshing}
                      isRealTimeEnabled={isRealTimeEnabled}
                      showDataFreshness={true}
                      onRefresh={lineChartData.refreshChartData}
                    />
                  </Suspense>
                </motion.div>
                
                {/* Pie Chart - Traffic Sources (Takes 1/3 width on right) */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="lg:col-span-1"
                >
                  <Suspense fallback={<LoadingSkeleton variant="chart" height={350} />}>
                    <LazyPieChart
                      title="Traffic Sources"
                      data={generatePieChartData()}
                      height={350}
                      lastUpdated={lastUpdated}
                      isRefreshing={isRefreshing}
                      isRealTimeEnabled={isRealTimeEnabled}
                      showDataFreshness={true}
                    />
                  </Suspense>
                </motion.div>
              </ResponsiveGrid>
              
              {/* Bar Chart - Full Width Performance Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                className="w-full mt-8"
              >
                <Suspense fallback={<LoadingSkeleton variant="chart" height={450} />}>
                  <LazyBarChart
                    title="Monthly Performance"
                    data={barChartData.data}
                    categories={['Revenue', 'Users', 'Conversions']}
                    height={450}
                    lastUpdated={lastUpdated}
                    isRefreshing={barChartData.isLoading || isRefreshing}
                    isRealTimeEnabled={isRealTimeEnabled}
                    showDataFreshness={true}
                    onRefresh={barChartData.refreshChartData}
                  />
                </Suspense>
              </motion.div>
            </section>
          </MobileFirstSection>

          {/* Date Range Analytics */}
          <MobileFirstSection>
            <section className="mt-16">
              <ResponsiveGrid cols={{ default: 1 }} gap="lg">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                >
                  <Suspense fallback={<LoadingSkeleton variant="card" height={300} />}>
                    <LazyDateRangePickerDemo />
                  </Suspense>
                </motion.div>
              </ResponsiveGrid>
            </section>
          </MobileFirstSection>

        </ResponsiveContainer>
        
          {/* Data Management Section */}
          <MobileFirstSection>
            <section className="mt-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.0 }}
                className="w-full overflow-hidden"
              >
                <Suspense fallback={<LoadingSkeleton variant="card" height={600} />}>
                  <LazyUnifiedFilteringDemo />
                </Suspense>
              </motion.div>
            </section>
          </MobileFirstSection>

        </main>
      </div>
    </div>
  );
}