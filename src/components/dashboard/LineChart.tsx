"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import ChartContainer from './ChartContainer';
import { ResponsiveChart } from './ResponsiveChart';
import { registerChartJS, defaultChartOptions } from '@/lib/chart-config';
import type { Chart as ChartJS } from 'chart.js';

// Register Chart.js components
registerChartJS();

interface LineChartProps {
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      fill?: boolean;
    }[];
  };
  height?: number;
  className?: string;
  loading?: boolean;
  subtitle?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  lastUpdated?: Date;
  isRefreshing?: boolean;
  isRealTimeEnabled?: boolean;
  showDataFreshness?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  title,
  data,
  height = 400,
  className,
  loading = false,
  subtitle,
  onRefresh,
  onExport,
  lastUpdated,
  isRefreshing = false,
  isRealTimeEnabled = true,
  showDataFreshness = false,
}) => {
  const chartRef = useRef<ChartJS<"line">>(null);
  const [hoveredDataset, setHoveredDataset] = useState<number | null>(null);
  
  // Get proper text color for dark/light mode
  const getTextColor = () => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      return isDark ? '#ffffff' : '#374151';
    }
    return '#374151';
  };
  
  // Compute maximum value across all datasets for unified y-axis scale
  const maxDataValue = Math.max(...data.datasets.flatMap(ds => ds.data));

  // Responsive options based on screen size
  const getResponsiveOptions = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth < 1024;
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      onHover: (_: any, elements: any[]) => {
        if (elements.length > 0) {
          setHoveredDataset(elements[0].datasetIndex);
        } else {
          setHoveredDataset(null);
        }
      },
    plugins: {
      legend: {
        display: false, // We'll handle legend separately
      },
      tooltip: {
        backgroundColor: 'hsl(var(--popover))',
        titleColor: 'hsl(var(--popover-foreground))',
        bodyColor: 'hsl(var(--popover-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
        titleFont: {
          size: isMobile ? 12 : 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: isMobile ? 11 : 13,
        },
        callbacks: {
          title: function(context: any[]) {
            return context[0]?.label || '';
          },
          label: function(context: { dataset: { label: string }; parsed: { y: number } }) {
            const value = context.parsed.y;
            const formattedValue = value >= 1000 
              ? `${(value / 1000).toFixed(1)}k` 
              : value.toLocaleString();
            return `${context.dataset.label}: ${formattedValue}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: { color: 'hsl(var(--border))', drawBorder: false },
        ticks: {
          color: getTextColor(),
          font: { size: isMobile ? 10 : isTablet ? 11 : 12, family: 'var(--font-sans)' },
          padding: isMobile ? 4 : 8,
          maxTicksLimit: isMobile ? 6 : isTablet ? 8 : 12,
        },
      },
      y: {
        type: 'linear',
        display: true,
        beginAtZero: true,
        suggestedMax: maxDataValue,
        grid: { color: 'hsl(var(--border))', drawBorder: false },
        ticks: {
          color: getTextColor(),
          font: { size: isMobile ? 10 : isTablet ? 11 : 12, family: 'var(--font-sans)' },
          padding: isMobile ? 4 : 8,
          maxTicksLimit: isMobile ? 5 : isTablet ? 6 : 8,
          callback: (value: string | number) =>
            typeof value === 'number'
              ? value >= 1000
                ? `${(value / 1000).toFixed(0)}k`
                : value.toLocaleString()
              : value,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: isMobile ? 2 : 3,
      },
      point: {
        radius: isMobile ? 3 : 4,
        hoverRadius: isMobile ? 6 : 8,
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    },
    animation: {
      duration: 800,
      easing: 'easeInOutQuart' as const,
    },
  };
  };

  const options: any = getResponsiveOptions();

  // Color palette for better visual consistency
  const colorPalette = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  // Enhanced data with better styling
  const enhancedData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => {
      const color = dataset.borderColor || colorPalette[index % colorPalette.length];
      return {
        ...dataset,
        borderColor: color,
        backgroundColor: dataset.backgroundColor || `${color}20`,
        fill: dataset.fill !== undefined ? dataset.fill : true,
        pointBackgroundColor: color,
        pointBorderColor: 'hsl(var(--background))',
        pointHoverBackgroundColor: 'hsl(var(--background))',
        pointHoverBorderColor: color,
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
      };
    }),
  };

  // Custom legend component with enhanced animations
  const CustomLegend = () => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="flex flex-wrap gap-4 justify-center mt-6 px-2"
    >
      {enhancedData.datasets.map((dataset, index) => (
        <motion.div
          key={dataset.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
          whileHover={{ 
            scale: 1.05, 
            y: -2,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 hover:bg-muted/50 ${
            hoveredDataset !== null && hoveredDataset !== index ? 'opacity-40' : 'opacity-100'
          }`}
        >
          <motion.div
            className="relative"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <div
              className="w-3 h-3 rounded-full border-2 relative z-10"
              style={{
                backgroundColor: dataset.borderColor,
                borderColor: 'hsl(var(--background))',
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full opacity-30"
              style={{ backgroundColor: dataset.borderColor }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
          <motion.div whileHover={{ x: 2 }}>
            <Badge variant="outline" className="text-xs font-medium">
              {dataset.label}
            </Badge>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      // Animate chart entrance with staggered effect
      chart.update('active');
    }
  }, [data]);

  return (
    <ResponsiveChart
      title={title}
      className={className}
      aspectRatio="video"
      minHeight={200}
      maxHeight={height}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.25, 0.46, 0.45, 0.94],
          staggerChildren: 0.1
        }}
        whileHover={{ 
          scale: 1.01,
          transition: { duration: 0.3 }
        }}
        className="w-full h-full flex flex-col relative group"
      >
        {/* Enhanced magical animated background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
          {/* Dynamic gradient waves */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"
            animate={{
              background: [
                "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.05) 50%, rgba(34,197,94,0.08) 100%)",
                "linear-gradient(225deg, rgba(34,197,94,0.08) 0%, rgba(59,130,246,0.05) 50%, rgba(139,92,246,0.1) 100%)",
                "linear-gradient(315deg, rgba(139,92,246,0.1) 0%, rgba(34,197,94,0.05) 50%, rgba(59,130,246,0.08) 100%)",
              ],
              opacity: [0.03, 0.06, 0.03]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Floating data point particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`datapoint-${i}`}
              className="absolute w-1.5 h-1.5 bg-primary/20 rounded-full"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`
              }}
              animate={{
                x: [0, 25, -20, 0],
                y: [0, -30, 20, 0],
                opacity: [0.1, 0.4, 0.2, 0.1],
                scale: [0.8, 1.2, 0.9, 0.8]
              }}
              transition={{
                duration: 6 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
            />
          ))}
          
          {/* Trend line simulation */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`trendline-${i}`}
              className="absolute w-16 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full"
              style={{
                left: `${i * 30}%`,
                top: `${30 + i * 20}%`,
                transform: `rotate(${15 + i * 10}deg)`
              }}
              animate={{
                x: [-20, 100],
                opacity: [0, 0.6, 0],
                scaleX: [0.5, 1.2, 0.8]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.8 + 1
              }}
            />
          ))}
          
          {/* Grid pattern enhancement */}
          <motion.div
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(var(--border)/0.05)_1px,transparent_1px),linear-gradient(rgba(var(--border)/0.05)_1px,transparent_1px)] bg-[size:20px_20px]"
            animate={{
              opacity: [0.02, 0.08, 0.02],
              x: [0, 5, 0],
              y: [0, 3, 0]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <motion.div 
          className="flex-1 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Line
            ref={chartRef}
            data={enhancedData}
            options={options}
          />
          
          {/* Enhanced hover overlay with ripple effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none border border-transparent group-hover:border-border/20 rounded-lg transition-all duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ 
              opacity: 1,
              boxShadow: "0 0 0 1px rgba(var(--border), 0.1), 0 8px 25px -5px rgba(var(--foreground), 0.1)"
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Chart interaction indicators */}
          {hoveredDataset !== null && (
            <motion.div
              className="absolute top-2 right-2 flex gap-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-primary/60 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
        
        <CustomLegend />
      </motion.div>
    </ResponsiveChart>
  );
};

export default LineChart;