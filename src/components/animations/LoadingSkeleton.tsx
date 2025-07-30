"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { BoxReveal } from "@/components/ui/box-reveal";
import { BorderBeam } from "@/components/ui/border-beam";

interface SkeletonProps {
  className?: string;
  animate?: boolean;
  style?: React.CSSProperties;
}

// Base skeleton component with shimmer effect
export function Skeleton({ className, animate = true, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted",
        animate && "animate-pulse",
        className
      )}
      style={style}
    >
      {animate && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
    </div>
  );
}

// Enhanced MetricCard skeleton with Magic UI effects
export function MetricCardSkeleton({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className={cn("h-full", className)}
    >
      <div className="relative h-full rounded-xl border bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm p-6 shadow-lg overflow-hidden min-h-[140px]">
        {/* Subtle border beam effect */}
        <BorderBeam
          size={120}
          duration={8}
          borderWidth={1}
          colorFrom="hsl(var(--primary))"
          colorTo="hsl(var(--primary))"
          className="opacity-30"
        />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-28 bg-neutral-200 dark:bg-neutral-700" />
          <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
            <Skeleton className="h-5 w-5 rounded bg-neutral-300 dark:bg-neutral-600" />
          </div>
        </div>
        
        {/* Main Value */}
        <div className="mb-3">
          <Skeleton className="h-9 w-24 bg-neutral-200 dark:bg-neutral-700" />
        </div>
        
        {/* Change Indicator */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-neutral-50 dark:bg-neutral-800/50">
          <Skeleton className="h-5 w-5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
          <Skeleton className="h-4 w-20 bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
    </motion.div>
  );
}

// Chart skeleton
export function ChartSkeleton({ 
  className,
  type = "line" 
}: { 
  className?: string;
  type?: "line" | "bar" | "pie";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn("rounded-lg border bg-card p-6", className)}
    >
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      
      {type === "pie" ? (
        <div className="flex items-center justify-center">
          <Skeleton className="h-48 w-48 rounded-full" />
        </div>
      ) : (
        <div className="space-y-3">
          {/* Chart area */}
          <div className="relative h-48">
            {type === "line" ? (
              <>
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-px w-full" />
                  ))}
                </div>
                {/* Line path */}
                <div className="absolute inset-0 flex items-end justify-between px-2">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const height = Math.random() * 60 + 20; // 20-80%
                    return (
                      <div 
                        key={i} 
                        className="w-1 rounded-full bg-muted animate-pulse"
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
              </>
            ) : (
              /* Bar chart */
              <div className="flex h-full items-end justify-between space-x-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton 
                    key={i} 
                    className="flex-1 rounded-t" 
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* X-axis labels */}
          <div className="flex justify-between">
            {Array.from({ length: type === "line" ? 6 : 4 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-8" />
            ))}
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="mt-4 flex justify-center space-x-6">
        {Array.from({ length: type === "pie" ? 4 : 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton className="h-3 w-3 rounded" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Table skeleton
export function TableSkeleton({ 
  className,
  rows = 5,
  columns = 6 
}: { 
  className?: string;
  rows?: number;
  columns?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={cn("rounded-lg border bg-card", className)}
    >
      {/* Table header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
        
        {/* Search bar */}
        <Skeleton className="h-10 w-64" />
      </div>
      
      {/* Table content */}
      <div className="p-4">
        {/* Column headers */}
        <div className="grid gap-4 pb-4 border-b" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        
        {/* Table rows */}
        <div className="space-y-4 pt-4">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div 
              key={rowIndex} 
              className="grid gap-4" 
              style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton 
                  key={colIndex} 
                  className="h-4"
                  style={{ width: `${Math.random() * 40 + 60}%` }}
                />
              ))}
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Skeleton className="h-4 w-32" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Dashboard skeleton - combines all components
export function DashboardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
      
      {/* Metrics cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
      
      {/* Charts section */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartSkeleton type="line" />
        <ChartSkeleton type="bar" />
      </div>
      
      {/* Table section */}
      <TableSkeleton />
    </div>
  );
}

// Loading state wrapper with smooth transitions
export function LoadingWrapper({
  isLoading,
  skeleton,
  children,
  className
}: {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <motion.div
        initial={false}
        animate={{ opacity: isLoading ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "absolute inset-0 z-10",
          !isLoading && "pointer-events-none"
        )}
      >
        {skeleton}
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3, delay: isLoading ? 0 : 0.1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Main LoadingSkeleton component with variant support
interface LoadingSkeletonProps {
  variant: "card" | "chart" | "table" | "dashboard";
  height?: number;
  className?: string;
  rows?: number;
  columns?: number;
}

export function LoadingSkeleton({ 
  variant, 
  height, 
  className, 
  rows, 
  columns 
}: LoadingSkeletonProps) {
  const style = height ? { height: `${height}px` } : {};
  
  switch (variant) {
    case "card":
      return <MetricCardSkeleton className={className} />;
    case "chart":
      return <ChartSkeleton className={className} />;
    case "table":
      return <TableSkeleton className={className} rows={rows} columns={columns} />;
    case "dashboard":
      return <DashboardSkeleton className={className} />;
    default:
      return <Skeleton className={className} />;
  }
}

// Default export for compatibility
export default LoadingSkeleton;