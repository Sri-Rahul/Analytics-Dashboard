"use client";

import { useState, Suspense } from 'react';
import { motion } from "framer-motion";
import { DollarSign, Users, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuroraText } from "@/components/ui/aurora-text";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { ResponsiveGrid, MobileFirstSection } from "@/components/layout/responsive-container";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DataFreshnessIndicator } from "@/components/dashboard/DataFreshnessIndicator";
import { useRealTimeData, useRealTimeChartData } from "@/hooks/useRealTimeData";
import { generatePieChartData } from "@/lib/data";
import { LoadingSkeleton } from '@/components/animations/LoadingSkeleton';

// Lazy load chart components
import { 
  LazyLineChart, 
  LazyBarChart, 
  LazyPieChart 
} from './LazyCharts';

// Lazy load demo components
import {
  LazyFilteringDemo,
  LazyExportDemo,
  LazyAdvancedFilterDemo,
  LazyDateRangePickerDemo,
  LazyPaginationDemo,
  LazyResponsiveLayoutDemo
} from './LazyDemos';

export default function DashboardContent() {
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

  const toggleRealTime = () => {
    if (isRealTimeEnabled) {
      stopRealTimeUpdates();
    } else {
      startRealTimeUpdates();
    }
    setIsRealTimeEnabled(!isRealTimeEnabled);
  };

  return (
    <>
      {/* Enhanced Data Freshness Indicator */}
      <MobileFirstSection>
        <DataFreshnessIndicator
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          isRealTimeEnabled={isRealTimeEnabled}
          onToggleRealTime={toggleRealTime}
          onForceRefresh={forceRefresh}
          showControls={true}
        />
      </MobileFirstSection>

      {/* Real-time Metrics Cards */}
      <MobileFirstSection>
        <motion.div 
          key={lastUpdated.getTime()} // Force re-render on data update
        >
          <ResponsiveGrid 
            cols={{ default: 1, sm: 2, lg: 4 }}
            gap="md"
          >
            <MetricCard
              title="Total Revenue"
              value={metrics.revenue.current}
              change={metrics.revenue.change}
              changeType={metrics.revenue.change >= 0 ? "positive" : "negative"}
              icon={DollarSign}
              format="currency"
              lastUpdated={lastUpdated}
              isRefreshing={isRefreshing}
              isRealTimeEnabled={isRealTimeEnabled}
              showDataStatus={true}
            />
            <MetricCard
              title="Active Users"
              value={metrics.users.current}
              change={metrics.users.change}
              changeType={metrics.users.change >= 0 ? "positive" : "negative"}
              icon={Users}
              format="number"
              lastUpdated={lastUpdated}
              isRefreshing={isRefreshing}
              isRealTimeEnabled={isRealTimeEnabled}
              showDataStatus={true}
            />
            <MetricCard
              title="Conversion Rate"
              value={metrics.conversions.current}
              change={metrics.conversions.change}
              changeType={metrics.conversions.change >= 0 ? "positive" : "negative"}
              icon={TrendingUp}
              format="percentage"
              lastUpdated={lastUpdated}
              isRefreshing={isRefreshing}
              isRealTimeEnabled={isRealTimeEnabled}
              showDataStatus={true}
            />
            <MetricCard
              title="Growth Rate"
              value={metrics.growth.current}
              change={metrics.growth.change}
              changeType={metrics.growth.change >= 0 ? "positive" : "negative"}
              icon={Activity}
              format="number"
              lastUpdated={lastUpdated}
              isRefreshing={isRefreshing}
              isRealTimeEnabled={isRealTimeEnabled}
              showDataStatus={true}
            />
          </ResponsiveGrid>
        </motion.div>
      </MobileFirstSection>

      {/* Real-time Metrics Bar */}
      <MobileFirstSection>
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
              {/* Professional Grid Layout */}
              <ResponsiveGrid 
                cols={{ default: 2, md: 4 }}
                gap="lg"
                className="relative z-10"
              >
                {/* Active Users */}
                <motion.div 
                  className="group relative p-4 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500/80" />
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="text-2xl font-bold text-blue-600 tracking-tight sm:text-3xl">
                      {realtimeMetrics.activeUsers}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active Users</div>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>

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
              
              {/* Subtle Activity Lines */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/20 via-green-500/20 to-purple-500/20" />
            </CardContent>
          </Card>
        </motion.div>
      </MobileFirstSection>

      {/* Charts Section with Lazy Loading */}
      <MobileFirstSection>
        <ResponsiveGrid 
          cols={{ default: 1, lg: 3 }}
          gap="lg"
        >
          <motion.div 
            className="lg:col-span-2"
            key={`line-${Array.isArray(lineChartData.data) ? lineChartData.data.length : (lineChartData.data?.labels?.length || 0)}`}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={<LoadingSkeleton variant="chart" height={300} />}>
              <LazyLineChart
                title="Revenue & Users Trend"
                data={lineChartData.data}
                height={300}
                lastUpdated={lastUpdated}
                isRefreshing={lineChartData.isLoading || isRefreshing}
                isRealTimeEnabled={isRealTimeEnabled}
                showDataFreshness={true}
                onRefresh={lineChartData.refreshChartData}
              />
            </Suspense>
          </motion.div>
          <motion.div
            key={`pie-${generatePieChartData().length}`}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={<LoadingSkeleton variant="chart" height={400} />}>
              <LazyPieChart
                title="Traffic Sources"
                data={generatePieChartData()}
                height={400}
                lastUpdated={lastUpdated}
                isRefreshing={isRefreshing}
                isRealTimeEnabled={isRealTimeEnabled}
                showDataFreshness={true}
              />
            </Suspense>
          </motion.div>
        </ResponsiveGrid>
      </MobileFirstSection>

      <MobileFirstSection>
        <motion.div 
          key={`bar-${Array.isArray(barChartData.data) ? barChartData.data.length : 0}`}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Suspense fallback={<LoadingSkeleton variant="chart" height={350} />}>
            <LazyBarChart
              title="Monthly Performance"
              data={barChartData.data}
              categories={['Revenue', 'Users', 'Conversions']}
              height={350}
              lastUpdated={lastUpdated}
              isRefreshing={barChartData.isLoading || isRefreshing}
              isRealTimeEnabled={isRealTimeEnabled}
              showDataFreshness={true}
              onRefresh={barChartData.refreshChartData}
            />
          </Suspense>
        </motion.div>
      </MobileFirstSection>

      {/* Lazy-loaded Demo Components */}
      <MobileFirstSection>
        <Suspense fallback={<LoadingSkeleton variant="card" height={300} />}>
          <LazyDateRangePickerDemo />
        </Suspense>
      </MobileFirstSection>

      <MobileFirstSection>
        <Suspense fallback={<LoadingSkeleton variant="card" height={500} />}>
          <LazyAdvancedFilterDemo />
        </Suspense>
      </MobileFirstSection>

      <MobileFirstSection>
        <Suspense fallback={<LoadingSkeleton variant="card" height={400} />}>
          <LazyExportDemo />
        </Suspense>
      </MobileFirstSection>

      <MobileFirstSection>
        <Suspense fallback={<LoadingSkeleton variant="card" height={600} />}>
          <LazyFilteringDemo />
        </Suspense>
      </MobileFirstSection>

      <MobileFirstSection>
        <Suspense fallback={<LoadingSkeleton variant="card" height={500} />}>
          <LazyPaginationDemo />
        </Suspense>
      </MobileFirstSection>

      <MobileFirstSection>
        <Suspense fallback={<LoadingSkeleton variant="card" height={400} />}>
          <LazyResponsiveLayoutDemo />
        </Suspense>
      </MobileFirstSection>


    </>
  );
}