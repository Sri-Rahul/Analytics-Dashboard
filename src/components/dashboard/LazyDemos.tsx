"use client";

import dynamic from 'next/dynamic';
import { LoadingSkeleton } from '@/components/animations/LoadingSkeleton';

// Lazy load demo components that contain heavy functionality
export const LazyFilteringDemo = dynamic(
  () => import('./FilteringDemo').then(mod => ({ default: mod.FilteringDemo })),
  {
    loading: () => (
      <LoadingSkeleton 
        variant="card" 
        height={600}
        className="rounded-lg"
      />
    ),
    ssr: false,
  }
);

export const LazyAdvancedFilterDemo = dynamic(
  () => import('./AdvancedFilterDemo').then(mod => ({ default: mod.AdvancedFilterDemo })),
  {
    loading: () => (
      <LoadingSkeleton 
        variant="card" 
        height={500}
        className="rounded-lg"
      />
    ),
    ssr: false,
  }
);

export const LazyDateRangePickerDemo = dynamic(
  () => import('./DateRangePickerDemo').then(mod => ({ default: mod.DateRangePickerDemo })),
  {
    loading: () => (
      <LoadingSkeleton 
        variant="card" 
        height={300}
        className="rounded-lg"
      />
    ),
    ssr: false,
  }
);

export const LazyPaginationDemo = dynamic(
  () => import('./PaginationDemo').then(mod => ({ default: mod.PaginationDemo })),
  {
    loading: () => (
      <LoadingSkeleton 
        variant="card" 
        height={500}
        className="rounded-lg"
      />
    ),
    ssr: false,
  }
);

export const LazyResponsiveLayoutDemo = dynamic(
  () => import('./ResponsiveLayoutDemo').then(mod => ({ default: mod.ResponsiveLayoutDemo })),
  {
    loading: () => (
      <LoadingSkeleton 
        variant="card" 
        height={400}
        className="rounded-lg"
      />
    ),
    ssr: false,
  }
);

export const LazyUnifiedFilteringDemo = dynamic(
  () => import('./UnifiedFilteringDemo').then(mod => ({ default: mod.UnifiedFilteringDemo })),
  {
    loading: () => (
      <LoadingSkeleton 
        variant="card" 
        height={600}
        className="rounded-lg"
      />
    ),
    ssr: false,
  }
);