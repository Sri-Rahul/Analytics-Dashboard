// Mock data generation utilities for the analytics dashboard

export interface DashboardMetrics {
  revenue: {
    current: number;
    previous: number;
    change: number;
  };
  users: {
    current: number;
    previous: number;
    change: number;
  };
  conversions: {
    current: number;
    previous: number;
    change: number;
  };
  growth: {
    current: number;
    previous: number;
    change: number;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export interface TableRow {
  id: string;
  campaign: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  revenue: number;
  date: Date;
}

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
}

export interface RealtimeMetrics {
  activeUsers: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  lastUpdated: Date;
}

// Utility functions for realistic data generation
function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateTrendingValue(baseValue: number, volatility: number = 0.1): number {
  const change = (Math.random() - 0.5) * 2 * volatility;
  return Math.max(0, baseValue * (1 + change));
}

function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

// Generate mock dashboard metrics with realistic variations
export function generateMockMetrics(): DashboardMetrics {
  const baseMetrics = {
    revenue: { base: 45231, volatility: 0.15 },
    users: { base: 2350, volatility: 0.12 },
    conversions: { base: 12.5, volatility: 0.20 },
    growth: { base: 573, volatility: 0.18 }
  };

  const metrics: DashboardMetrics = {} as DashboardMetrics;

  Object.entries(baseMetrics).forEach(([key, config]) => {
    const current = generateTrendingValue(config.base, config.volatility);
    const previous = generateTrendingValue(config.base * 0.9, config.volatility);
    const change = calculatePercentageChange(current, previous);

    (metrics as any)[key] = {
      current: key === 'conversions' ? Math.round(current * 10) / 10 : Math.round(current),
      previous: key === 'conversions' ? Math.round(previous * 10) / 10 : Math.round(previous),
      change: Math.round(change * 10) / 10
    };
  });

  return metrics;
}

// Generate mock chart data with multiple datasets
export function generateMockChartData(type: 'line' | 'bar' | 'pie' = 'line'): ChartData {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  if (type === 'pie') {
    return {
      labels: ['Desktop', 'Mobile', 'Tablet', 'Other'],
      datasets: [
        {
          label: 'Traffic Sources',
          data: [45, 35, 15, 5],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(239, 68, 68)'
          ],
          borderWidth: 2
        }
      ]
    };
  }

  const revenueData = labels.map(() => randomBetween(15000, 55000));
  const usersData = labels.map(() => randomBetween(1200, 3500));
  const conversionsData = labels.map(() => randomBetween(8, 18));

  const datasets = [
    {
      label: 'Revenue',
      data: revenueData,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: type === 'bar' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2
    }
  ];

  if (type === 'line') {
    datasets.push(
      {
        label: 'Users',
        data: usersData,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2
      },
      {
        label: 'Conversion Rate',
        data: conversionsData,
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 2
      }
    );
  }

  return { labels, datasets };
}

// Generate mock table data with realistic campaign data
export function generateMockTableData(count: number = 20): TableRow[] {
  const campaigns = [
    'Summer Sale 2024', 'Black Friday Deals', 'New Year Promotion', 'Spring Launch',
    'Holiday Special', 'Back to School', 'Valentine\'s Day', 'Easter Sale',
    'Mother\'s Day', 'Father\'s Day', 'Independence Day', 'Labor Day',
    'Halloween Campaign', 'Thanksgiving Sale', 'Cyber Monday', 'Flash Sale',
    'Weekend Special', 'Mobile App Launch', 'Product Launch', 'Brand Awareness'
  ];

  const generateRealisticMetrics = () => {
    const impressions = Math.floor(randomBetween(10000, 500000));
    const clickRate = randomBetween(0.01, 0.05); // 1-5% CTR
    const clicks = Math.floor(impressions * clickRate);
    const conversionRate = randomBetween(0.02, 0.15); // 2-15% conversion rate
    const conversions = Math.floor(clicks * conversionRate);
    const costPerClick = randomBetween(0.5, 5.0);
    const cost = Math.floor(clicks * costPerClick);
    const revenuePerConversion = randomBetween(50, 500);
    const revenue = Math.floor(conversions * revenuePerConversion);

    return { impressions, clicks, conversions, cost, revenue };
  };

  return Array.from({ length: count }, (_, index) => {
    const metrics = generateRealisticMetrics();
    const campaignName = campaigns[index % campaigns.length];
    const daysAgo = Math.floor(randomBetween(1, 90));
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    return {
      id: `campaign-${index + 1}`,
      campaign: campaignName,
      ...metrics,
      date
    };
  });
}

// Generate time series data for real-time charts
export function generateTimeSeriesData(
  hours: number = 24,
  baseValue: number = 100,
  volatility: number = 0.1
): TimeSeriesData[] {
  const data: TimeSeriesData[] = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const value = generateTrendingValue(baseValue, volatility);
    data.push({ timestamp, value });
  }
  
  return data;
}

// Generate real-time metrics that update frequently
export function generateRealtimeMetrics(): RealtimeMetrics {
  return {
    activeUsers: Math.floor(randomBetween(150, 850)),
    pageViews: Math.floor(randomBetween(2500, 8500)),
    bounceRate: Math.round(randomBetween(25, 65) * 10) / 10,
    avgSessionDuration: Math.round(randomBetween(120, 480)), // seconds
    lastUpdated: new Date()
  };
}

// Simulate data refresh with slight variations
export function refreshMetrics(currentMetrics: DashboardMetrics): DashboardMetrics {
  const refreshedMetrics: DashboardMetrics = {} as DashboardMetrics;

  Object.entries(currentMetrics).forEach(([key, metric]) => {
    const variation = randomBetween(-0.02, 0.02); // ±2% variation
    const newCurrent = Math.max(0, metric.current * (1 + variation));
    const newChange = calculatePercentageChange(newCurrent, metric.previous);

    (refreshedMetrics as any)[key] = {
      current: key === 'conversions' ? Math.round(newCurrent * 10) / 10 : Math.round(newCurrent),
      previous: metric.previous,
      change: Math.round(newChange * 10) / 10
    };
  });

  return refreshedMetrics;
}

// Data refresh utility for real-time updates
export class DataRefreshManager {
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  startRefresh(
    key: string,
    callback: () => void,
    intervalMs: number = 5000
  ): void {
    this.stopRefresh(key);
    const interval = setInterval(callback, intervalMs);
    this.intervals.set(key, interval);
  }

  stopRefresh(key: string): void {
    const interval = this.intervals.get(key);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(key);
    }
  }

  stopAllRefresh(): void {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals.clear();
  }
}

// Generate data specifically for Tremor BarChart
export function generateBarChartData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return months.map(month => ({
    name: month,
    Revenue: Math.floor(randomBetween(15000, 55000)),
    Users: Math.floor(randomBetween(1200, 3500)),
    Conversions: Math.floor(randomBetween(800, 1800)),
  }));
}

// Generate data for PieChart component
export function generatePieChartData() {
  return [
    { name: 'Desktop', value: 4500, color: '#3b82f6' },
    { name: 'Mobile', value: 3200, color: '#10b981' },
    { name: 'Tablet', value: 1800, color: '#f59e0b' },
    { name: 'Other', value: 500, color: '#ef4444' },
  ];
}

// Generate data for LineChart component
export function generateLineChartData() {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: labels.map(() => Math.floor(randomBetween(15000, 55000))),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
      },
      {
        label: 'Users',
        data: labels.map(() => Math.floor(randomBetween(1200, 3500))),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
      },
    ],
  };
}