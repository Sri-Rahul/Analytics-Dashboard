// Performance monitoring utilities for code splitting and lazy loading

export interface PerformanceMetrics {
  componentLoadTime: number;
  bundleSize?: number;
  chunkName?: string;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics[]> = new Map();

  // Track component loading time
  trackComponentLoad(componentName: string, startTime: number): void {
    const loadTime = performance.now() - startTime;
    
    const metric: PerformanceMetrics = {
      componentLoadTime: loadTime,
      timestamp: Date.now(),
    };

    if (!this.metrics.has(componentName)) {
      this.metrics.set(componentName, []);
    }
    
    this.metrics.get(componentName)?.push(metric);
    
    // Log performance in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
    }
  }

  // Get average loading time for a component
  getAverageLoadTime(componentName: string): number {
    const componentMetrics = this.metrics.get(componentName);
    if (!componentMetrics || componentMetrics.length === 0) return 0;

    const totalTime = componentMetrics.reduce((sum, metric) => sum + metric.componentLoadTime, 0);
    return totalTime / componentMetrics.length;
  }

  // Get all metrics for a component
  getComponentMetrics(componentName: string): PerformanceMetrics[] {
    return this.metrics.get(componentName) || [];
  }

  // Get performance summary
  getPerformanceSummary(): Record<string, { averageLoadTime: number; loadCount: number }> {
    const summary: Record<string, { averageLoadTime: number; loadCount: number }> = {};
    
    this.metrics.forEach((metrics, componentName) => {
      summary[componentName] = {
        averageLoadTime: this.getAverageLoadTime(componentName),
        loadCount: metrics.length,
      };
    });

    return summary;
  }

  // Clear metrics (useful for testing)
  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Hook for tracking component performance
export function usePerformanceTracking(componentName: string) {
  const startTime = performance.now();

  return {
    trackLoad: () => performanceMonitor.trackComponentLoad(componentName, startTime),
    getMetrics: () => performanceMonitor.getComponentMetrics(componentName),
    getAverageLoadTime: () => performanceMonitor.getAverageLoadTime(componentName),
  };
}

// Utility to measure bundle size impact
export function measureBundleImpact() {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const jsResources = resources.filter(resource => 
      resource.name.includes('.js') && !resource.name.includes('hot-update')
    );

    const totalJSSize = jsResources.reduce((total, resource) => {
      return total + (resource.transferSize || 0);
    }, 0);

    const metrics = {
      totalJSSize: totalJSSize,
      jsResourceCount: jsResources.length,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstContentfulPaint: 0, // Will be populated by web vitals if available
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Bundle Performance Metrics:', metrics);
    }

    return metrics;
  }

  return null;
}

// Web Vitals tracking for lazy-loaded components
export function trackWebVitals() {
  if (typeof window !== 'undefined') {
    // Track Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🎯 LCP:', lastEntry.startTime);
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Track First Input Delay (FID)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('⚡ FID:', entry.processingStart - entry.startTime);
        }
      });
    }).observe({ entryTypes: ['first-input'] });

    // Track Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📐 CLS:', clsValue);
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }
}

// Initialize performance tracking
if (typeof window !== 'undefined') {
  // Track initial bundle metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      measureBundleImpact();
      trackWebVitals();
    }, 1000);
  });
}