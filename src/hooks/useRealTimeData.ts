"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { 
  DashboardMetrics, 
  RealtimeMetrics, 
  generateMockMetrics, 
  generateRealtimeMetrics, 
  refreshMetrics,
  DataRefreshManager 
} from '@/lib/data';

interface UseRealTimeDataOptions {
  refreshInterval?: number;
  autoStart?: boolean;
  enableRealtime?: boolean;
}

export function useRealTimeData(options: UseRealTimeDataOptions = {}) {
  const {
    refreshInterval = 5000, // 5 seconds
    autoStart = true,
    enableRealtime = true
  } = options;

  const [metrics, setMetrics] = useState<DashboardMetrics>(() => generateMockMetrics());
  const [realtimeMetrics, setRealtimeMetrics] = useState<RealtimeMetrics>(() => generateRealtimeMetrics());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const refreshManagerRef = useRef<DataRefreshManager>(new DataRefreshManager());

  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    
    // Simulate network delay
    setTimeout(() => {
      setMetrics(currentMetrics => refreshMetrics(currentMetrics));
      setRealtimeMetrics(generateRealtimeMetrics());
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 200 + Math.random() * 300); // 200-500ms delay
  }, []);

  const startRealTimeUpdates = useCallback(() => {
    if (!enableRealtime) return;
    
    refreshManagerRef.current.startRefresh(
      'dashboard-metrics',
      refreshData,
      refreshInterval
    );
  }, [refreshData, refreshInterval, enableRealtime]);

  const stopRealTimeUpdates = useCallback(() => {
    refreshManagerRef.current.stopRefresh('dashboard-metrics');
  }, []);

  const forceRefresh = useCallback(() => {
    refreshData();
  }, [refreshData]);

  // Auto-start real-time updates
  useEffect(() => {
    if (autoStart && enableRealtime) {
      startRealTimeUpdates();
    }

    return () => {
      refreshManagerRef.current.stopAllRefresh();
    };
  }, [autoStart, enableRealtime, startRealTimeUpdates]);

  return {
    metrics,
    realtimeMetrics,
    isRefreshing,
    lastUpdated,
    startRealTimeUpdates,
    stopRealTimeUpdates,
    forceRefresh
  };
}

// Hook for managing chart data with real-time updates
export function useRealTimeChartData(chartType: 'line' | 'bar' | 'pie' = 'line') {
  const [data, setData] = useState<any>(() => {
    // Initialize with appropriate empty data structure based on chart type
    if (chartType === 'bar') {
      return [];
    }
    return { labels: [], datasets: [] };
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      if (chartType === 'bar') {
        const { generateBarChartData } = await import('@/lib/data');
        setData(generateBarChartData());
      } else if (chartType === 'pie') {
        const { generatePieChartData } = await import('@/lib/data');
        setData(generatePieChartData());
      } else {
        const { generateLineChartData } = await import('@/lib/data');
        setData(generateLineChartData());
      }
    };
    initializeData();
  }, [chartType]);

  const refreshChartData = useCallback(async () => {
    setIsLoading(true);
    
    setTimeout(async () => {
      if (chartType === 'bar') {
        const { generateBarChartData } = await import('@/lib/data');
        setData(generateBarChartData());
      } else if (chartType === 'pie') {
        const { generatePieChartData } = await import('@/lib/data');
        setData(generatePieChartData());
      } else {
        const { generateLineChartData } = await import('@/lib/data');
        setData(generateLineChartData());
      }
      setIsLoading(false);
    }, 300);
  }, [chartType]);

  return {
    data,
    isLoading,
    refreshChartData
  };
}

// Hook for managing table data with pagination and real-time updates
export function useRealTimeTableData(pageSize: number = 10) {
  const [data, setData] = useState<any[]>([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      const { generateMockTableData } = await import('@/lib/data');
      setData(generateMockTableData(50));
    };
    initializeData();
  }, []);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  const refreshTableData = useCallback(async () => {
    setIsLoading(true);
    
    setTimeout(async () => {
      const { generateMockTableData } = await import('@/lib/data');
      setData(generateMockTableData(50));
      setIsLoading(false);
    }, 500);
  }, []);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  return {
    data: paginatedData,
    allData: data,
    currentPage,
    totalPages,
    pageSize,
    isLoading,
    refreshTableData,
    goToPage,
    goToNextPage: () => goToPage(currentPage + 1),
    goToPreviousPage: () => goToPage(currentPage - 1)
  };
}