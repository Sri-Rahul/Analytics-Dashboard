"use client";

import React, { useState } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import ChartContainer from './ChartContainer';

interface BarChartProps {
  title: string;
  data: {
    name: string;
    [key: string]: string | number;
  }[];
  categories: string[];
  colors?: string[];
  height?: number | string;
  className?: string;
  loading?: boolean;
  valueFormatter?: (value: number) => string;
  subtitle?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  showLegend?: boolean;
  lastUpdated?: Date;
  isRefreshing?: boolean;
  isRealTimeEnabled?: boolean;
  showDataFreshness?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  title,
  data,
  categories,
  colors = ['blue', 'emerald', 'violet', 'amber', 'rose'],
  height = 'auto',
  className,
  loading = false,
  valueFormatter = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toLocaleString();
  },
  subtitle,
  onRefresh,
  onExport,
  showLegend = true,
  lastUpdated,
  isRefreshing = false,
  isRealTimeEnabled = true,
  showDataFreshness = false,
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Modern color palette for bars
  const barColors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

  // Handle empty data or loading state
  if (loading) {
    return (
      <ChartContainer
        title={title}
        subtitle={subtitle}
        height={height}
        className={className}
        loading={true}
        interactive={true}
        onRefresh={onRefresh}
        onExport={onExport}
        fullscreenEnabled={true}
        tooltipContent="Interactive bar chart with proper landscape layout and hover effects"
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        isRealTimeEnabled={isRealTimeEnabled}
        showDataFreshness={showDataFreshness}
      >
        <div className="flex items-center justify-center h-full min-h-[300px] text-muted-foreground">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="ml-3">Loading chart data...</p>
        </div>
      </ChartContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ChartContainer
        title={title}
        subtitle={subtitle}
        height={height}
        className={className}
        loading={loading}
        interactive={true}
        onRefresh={onRefresh}
        onExport={onExport}
        fullscreenEnabled={true}
        tooltipContent="Interactive bar chart with proper landscape layout and hover effects"
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        isRealTimeEnabled={isRealTimeEnabled}
        showDataFreshness={showDataFreshness}
      >
        <div className="flex items-center justify-center h-full min-h-[300px] text-muted-foreground">
          <p>No data available for the chart. Click refresh to load data.</p>
        </div>
      </ChartContainer>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.dataKey}:</span>
              <span className="font-semibold text-primary">
                {valueFormatter(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => {
    if (!showLegend) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-wrap gap-2 justify-center mt-2 px-2"
      >
        {categories.map((category, index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.08 }}
            whileHover={{ 
              scale: 1.05, 
              y: -2,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setActiveCategory(category)}
            onHoverEnd={() => setActiveCategory(null)}
            className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md transition-all duration-200 hover:bg-muted/60 group ${
              activeCategory !== null && activeCategory !== category ? 'opacity-40' : 'opacity-100'
            }`}
          >
            <motion.div
              className="relative"
              whileHover={{ 
                rotate: [0, 8, -8, 0],
                scale: [1, 1.1, 1.1, 1]
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div
                className="w-3 h-3 rounded-sm border shadow-sm relative z-10"
                style={{ 
                  backgroundColor: barColors[index % barColors.length],
                  borderColor: 'hsl(var(--background))'
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-sm opacity-25"
                style={{ backgroundColor: barColors[index % barColors.length] }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.25, 0.1, 0.25]
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.15
                }}
              />
            </motion.div>
            <motion.div whileHover={{ x: 1 }}>
              <Badge variant="outline" className="text-xs font-medium group-hover:bg-muted/30">
                {category}
              </Badge>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      height={height}
      className={className}
      loading={loading}
      interactive={true}
      onRefresh={onRefresh}
      onExport={onExport}
      fullscreenEnabled={true}
      tooltipContent="Interactive bar chart with proper landscape layout and hover effects"
      lastUpdated={lastUpdated}
      isRefreshing={isRefreshing}
      isRealTimeEnabled={isRealTimeEnabled}
      showDataFreshness={showDataFreshness}
    >
      <motion.div 
        className="w-full h-full flex flex-col relative group overflow-hidden"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        whileHover={{ 
          scale: 1.005,
          transition: { duration: 0.3 }
        }}
      >
        {/* Enhanced animated background */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-lg overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/12 via-transparent to-secondary/8"
            animate={{
              opacity: [0.02, 0.06, 0.02],
              scale: [1, 1.03, 1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-xl"
            animate={{
              x: [0, 80, 0],
              y: [0, -20, 0],
              opacity: [0.1, 0.25, 0.1]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Chart Container - Adjusted height to accommodate legend */}
        <motion.div 
          className="w-full h-full min-h-[350px] [&_.recharts-text]:!fill-current [&_.recharts-cartesian-axis-tick-value]:!fill-current text-foreground"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ 
            height: showLegend ? (height === 'auto' ? '350px' : `${parseFloat(height.toString()) - 100}px`) : (height === 'auto' ? '450px' : height), 
            minHeight: '350px',
            maxHeight: showLegend ? (height === 'auto' ? '350px' : `${parseFloat(height.toString()) - 100}px`) : (height === 'auto' ? '450px' : height)
          }}
        >
          <ResponsiveContainer width="100%" height="100%" minHeight={400}>
            <RechartsBarChart
              data={data}
              margin={{
                top: 30,
                right: 40,
                left: 40,
                bottom: 80,
              }}
              barCategoryGap="20%"
              maxBarSize={60}
              className="w-full text-foreground"
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))"
                opacity={0.3}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'currentColor' }}
                height={60}
                interval={0}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'currentColor' }}
                tickFormatter={valueFormatter}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              {categories.map((category, index) => (
                <Bar
                  key={category}
                  dataKey={category}
                  fill={barColors[index % barColors.length]}
                  stroke={barColors[index % barColors.length]}
                  strokeWidth={1}
                  radius={[4, 4, 0, 0]}
                  onMouseEnter={() => setActiveCategory(category)}
                  onMouseLeave={() => setActiveCategory(null)}
                  style={{
                    filter: activeCategory === null || activeCategory === category ? 'none' : 'opacity(0.6)',
                    transition: 'all 0.3s ease',
                  }}
                  animationBegin={200}
                  animationDuration={600}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
          
          {/* Hover enhancement overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none border border-transparent group-hover:border-border/25 rounded-lg transition-all duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
        </motion.div>
        
        {/* Legend contained within card */}
        {showLegend && (
          <motion.div 
            className="mt-1 px-2 pb-2 max-h-[100px] overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <CustomLegend />
          </motion.div>
        )}
      </motion.div>
    </ChartContainer>
  );
};

export default BarChart;