"use client";

import React, { useState } from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import ChartContainer from './ChartContainer';

interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  title: string;
  data: PieChartData[];
  height?: number;
  className?: string;
  loading?: boolean;
  showLegend?: boolean;
  subtitle?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  lastUpdated?: Date;
  isRefreshing?: boolean;
  isRealTimeEnabled?: boolean;
  showDataFreshness?: boolean;
  valueFormatter?: (value: number) => string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const PieChart: React.FC<PieChartProps> = ({
  title,
  data,
  height = 400, // Increased to show legend properly
  className,
  loading = false,
  showLegend = true,
  subtitle,
  onRefresh,
  onExport,
  lastUpdated,
  isRefreshing = false,
  isRealTimeEnabled = true,
  showDataFreshness = false,
  valueFormatter = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toLocaleString();
  },
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Prepare data with colors
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length],
  }));

  // Calculate total for percentage
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm">{data.name}</p>
          <p className="text-sm text-primary">
            {valueFormatter(data.value)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {payload.map((entry: any, index: number) => {
          const percentage = ((entry.payload.value / total) * 100).toFixed(1);
          return (
            <motion.div
              key={`legend-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              whileHover={{ 
                scale: 1.02, 
                y: -1,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-between p-2 rounded-md bg-muted/30 hover:bg-muted/60 transition-all duration-200 cursor-pointer group ${
                activeIndex !== null && activeIndex !== index ? 'opacity-50' : 'opacity-100'
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="relative"
                  whileHover={{ 
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.15, 1.15, 1]
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <div
                    className="w-3 h-3 rounded-full border shadow-sm relative z-10"
                    style={{ 
                      backgroundColor: entry.color,
                      borderColor: 'hsl(var(--background))'
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-20"
                    style={{ backgroundColor: entry.color }}
                    animate={{
                      scale: [1, 1.6, 1],
                      opacity: [0.2, 0.05, 0.2]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3
                    }}
                  />
                </motion.div>
                <motion.span 
                  className="font-medium text-xs group-hover:text-primary transition-colors"
                  whileHover={{ x: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {entry.value}
                </motion.span>
              </div>
              <motion.div 
                className="flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
              >
                <span className="text-xs font-semibold text-primary">{valueFormatter(entry.payload.value)}</span>
                <Badge variant="outline" className="text-xs font-mono group-hover:bg-muted/40">
                  {percentage}%
                </Badge>
              </motion.div>
            </motion.div>
          );
        })}
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
      showLegend={false}
      onRefresh={onRefresh}
      onExport={onExport}
      fullscreenEnabled={true}
      tooltipContent="Interactive pie chart with professional styling"
      lastUpdated={lastUpdated}
      isRefreshing={isRefreshing}
      isRealTimeEnabled={isRealTimeEnabled}
      showDataFreshness={showDataFreshness}
    >
      <motion.div 
        className="w-full h-full flex flex-col relative group overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        whileHover={{ 
          scale: 1.01,
          rotateY: 2,
          transition: { duration: 0.3 }
        }}
        style={{ perspective: "1000px" }}
      >
        {/* Enhanced animated background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-lg overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15"
            animate={{
              opacity: [0.03, 0.07, 0.03],
              scale: [1, 1.02, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/4 right-1/4 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl"
            animate={{
              x: [0, 20, 0],
              y: [0, -15, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Chart Container - Adjusted for better legend visibility */}
        <motion.div 
          className="w-full flex-1 min-h-[200px] flex items-center justify-center py-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="w-full max-w-[280px] aspect-square relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Center value display */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "backOut" }}
            >
              <div className="text-center">
                <motion.div 
                  className="text-2xl font-bold text-foreground"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {total.toLocaleString()}
                </motion.div>
                <div className="text-xs text-muted-foreground font-medium">Total</div>
              </div>
            </motion.div>

            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="35%"
                  outerRadius="85%"
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  animationBegin={100}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={activeIndex === index ? 'hsl(var(--primary))' : 'transparent'}
                      strokeWidth={activeIndex === index ? 3 : 0}
                      style={{
                        filter: activeIndex === index ? 'brightness(1.15) drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))' : 'brightness(1)',
                        transition: 'all 0.3s ease',
                        transformOrigin: 'center'
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RechartsPieChart>
            </ResponsiveContainer>
            
            {/* Hover enhancement overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none border border-transparent group-hover:border-border/30 rounded-lg transition-all duration-300"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
          </motion.div>
        </motion.div>
        
        {/* Enhanced Legend - Contained within card */}
        {showLegend && (
          <motion.div 
            className="mt-1 px-2 pb-2 max-h-[140px] overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <CustomLegend payload={chartData.map((item, index) => ({
              value: item.name,
              color: item.color,
              payload: item
            }))} />
          </motion.div>
        )}
      </motion.div>
    </ChartContainer>
  );
};

export default PieChart;