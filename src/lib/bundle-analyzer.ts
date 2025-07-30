// Bundle analysis utilities for optimization

export interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: ChunkInfo[];
  duplicates: DuplicateModule[];
  unusedExports: UnusedExport[];
}

export interface ChunkInfo {
  name: string;
  size: number;
  modules: string[];
  isAsync: boolean;
}

export interface DuplicateModule {
  module: string;
  chunks: string[];
  totalSize: number;
}

export interface UnusedExport {
  module: string;
  exports: string[];
  potentialSavings: number;
}

// Tree shaking optimization recommendations
export const TREE_SHAKING_RECOMMENDATIONS = {
  // Import only what you need from large libraries
  lodash: {
    bad: "import _ from 'lodash'",
    good: "import { debounce } from 'lodash'",
    savings: "~70KB"
  },
  
  // Use specific imports for UI libraries
  lucideReact: {
    bad: "import * as Icons from 'lucide-react'",
    good: "import { Search, Filter } from 'lucide-react'",
    savings: "~50KB"
  },
  
  // Import specific chart components
  chartjs: {
    bad: "import Chart from 'chart.js/auto'",
    good: "import { Chart, CategoryScale, LinearScale } from 'chart.js'",
    savings: "~30KB"
  },
  
  // Use specific Framer Motion imports
  framerMotion: {
    bad: "import * as Motion from 'framer-motion'",
    good: "import { motion, AnimatePresence } from 'framer-motion'",
    savings: "~20KB"
  }
};

// Bundle optimization utilities
export class BundleOptimizer {
  // Analyze import patterns and suggest optimizations
  static analyzeImports(sourceCode: string): string[] {
    const suggestions: string[] = [];
    
    // Check for wildcard imports
    const wildcardImports = sourceCode.match(/import \* as \w+ from ['"][^'"]+['"]/g);
    if (wildcardImports) {
      suggestions.push("Consider using specific imports instead of wildcard imports to enable tree shaking");
    }
    
    // Check for default imports from libraries that support tree shaking
    const defaultImports = sourceCode.match(/import \w+ from ['"](?:lodash|ramda|date-fns)['"]/g);
    if (defaultImports) {
      suggestions.push("Use specific imports from utility libraries (e.g., import { debounce } from 'lodash')");
    }
    
    // Check for unused imports
    const importStatements = sourceCode.match(/import\s+{([^}]+)}\s+from\s+['"][^'"]+['"]/g);
    if (importStatements) {
      importStatements.forEach(statement => {
        const imports = statement.match(/{([^}]+)}/)?.[1]?.split(',').map(s => s.trim()) || [];
        imports.forEach(importName => {
          const cleanImportName = importName.replace(/\s+as\s+\w+/, '');
          const regex = new RegExp(`\\b${cleanImportName}\\b`, 'g');
          const matches = sourceCode.match(regex);
          if (!matches || matches.length <= 1) {
            suggestions.push(`Consider removing unused import: ${cleanImportName}`);
          }
        });
      });
    }
    
    return suggestions;
  }
  
  // Generate webpack bundle analyzer report
  static generateAnalyzerConfig() {
    return {
      webpack: (config: any, { isServer }: { isServer: boolean }) => {
        if (!isServer && process.env.ANALYZE === 'true') {
          const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
          config.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              reportFilename: '../bundle-analyzer-report.html',
              openAnalyzer: false,
            })
          );
        }
        return config;
      },
    };
  }
  
  // Identify potential code splitting opportunities
  static identifyCodeSplittingOpportunities(modules: string[]): string[] {
    const opportunities: string[] = [];
    
    const heavyLibraries = [
      'chart.js',
      'react-chartjs-2',
      '@tremor/react',
      'framer-motion',
      'jspdf',
      '@tanstack/react-table'
    ];
    
    heavyLibraries.forEach(lib => {
      if (modules.some(module => module.includes(lib))) {
        opportunities.push(`Consider lazy loading components that use ${lib}`);
      }
    });
    
    return opportunities;
  }
  
  // Calculate potential savings from optimizations
  static calculatePotentialSavings(): Record<string, number> {
    return {
      'Tree shaking lodash': 70000, // 70KB
      'Lazy loading charts': 150000, // 150KB
      'Code splitting animations': 80000, // 80KB
      'Optimizing images': 200000, // 200KB
      'Removing unused CSS': 50000, // 50KB
    };
  }
}

// Performance monitoring for bundle optimization
export function trackBundlePerformance() {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'resource' && entry.name.includes('.js')) {
          const resource = entry as PerformanceResourceTiming;
          
          // Log large JavaScript bundles
          if (resource.transferSize && resource.transferSize > 100000) { // > 100KB
            console.warn(`Large bundle detected: ${entry.name} (${Math.round(resource.transferSize / 1024)}KB)`);
          }
          
          // Log slow loading resources
          if (resource.duration > 1000) { // > 1 second
            console.warn(`Slow loading resource: ${entry.name} (${Math.round(resource.duration)}ms)`);
          }
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
    
    // Clean up observer after 30 seconds
    setTimeout(() => observer.disconnect(), 30000);
  }
}

// Initialize bundle performance tracking in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  trackBundlePerformance();
}