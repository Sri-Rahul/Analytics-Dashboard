"use client";

import dynamic from 'next/dynamic';
import { LoadingSkeleton } from '@/components/animations/LoadingSkeleton';
import { ChartErrorBoundary } from '@/components/ui/chart-error-boundary';
import { performanceMonitor } from '@/lib/performance';

// Wrapper component to add error boundary to lazy loaded charts
const withErrorBoundary = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => (
    <ChartErrorBoundary>
      <WrappedComponent {...props} />
    </ChartErrorBoundary>
  );
};

// Lazy load chart components with loading fallbacks and performance tracking
export const LazyLineChart = dynamic(
  () => {
    const startTime = performance.now();
    return import('./LineChart').then(mod => {
      performanceMonitor.trackComponentLoad('LineChart', startTime);
      return { default: mod.default };
    });
  },
  {
    loading: () => (
      <LoadingSkeleton 
        variant="chart" 
        height={400}
        className="rounded-lg"
      />
    ),
    ssr: false, // Disable SSR for chart components to avoid hydration issues
  }
);

export const LazyBarChart = dynamic(
  () => {
    const startTime = performance.now();
    return import('./BarChart').then(mod => {
      performanceMonitor.trackComponentLoad('BarChart', startTime);
      return { default: mod.default };
    });
  },
  {
    loading: () => (
      <LoadingSkeleton 
        variant="chart" 
        height={400}
        className="rounded-lg"
      />
    ),
    ssr: false,
  }
);

export const LazyPieChart = dynamic(
  () => {
    const startTime = performance.now();
    return import('./PieChart').then(mod => {
      performanceMonitor.trackComponentLoad('PieChart', startTime);
      return { default: mod.default };
    });
  },
  {
    loading: () => (
      <LoadingSkeleton 
        variant="chart" 
        height={400}
        className="rounded-lg"
      />
    ),
    ssr: false,
  }
);

// Lazy load export functionality
export const LazyExportButtons = dynamic(
  () => {
    const startTime = performance.now();
    return import('./ExportButtons').then(mod => {
      performanceMonitor.trackComponentLoad('ExportButtons', startTime);
      return { default: mod.ExportButtons };
    });
  },
  {
    loading: () => (
      <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
    ),
    ssr: false,
  }
);

// Lazy load data table with advanced features
export const LazyDataTable = dynamic(
  () => import('./DataTable').then(mod => ({ default: mod.DataTable })),
  {
    loading: () => (
      <LoadingSkeleton 
        variant="table" 
        height={400}
        className="rounded-lg"
      />
    ),
    ssr: false,
  }
);

// Lazy load filtering components
export const LazyFilterPanel = dynamic(
  () => import('./FilterPanel').then(mod => ({ default: mod.FilterPanel })),
  {
    loading: () => (
      <div className="h-12 bg-muted animate-pulse rounded-md" />
    ),
    ssr: false,
  }
);

// Lazy load date range picker
export const LazyDateRangePicker = dynamic(
  () => import('@/components/ui/date-range-picker').then(mod => ({ default: mod.DateRangePicker })),
  {
    loading: () => (
      <div className="h-10 w-64 bg-muted animate-pulse rounded-md" />
    ),
    ssr: false,
  }
);