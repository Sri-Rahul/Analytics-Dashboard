"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MagicCard } from '@/components/ui/magic-card';
import { BorderBeam } from '@/components/ui/border-beam';
import { DataFreshnessIndicator } from '@/components/dashboard/DataFreshnessIndicator';
import { cn } from '@/lib/utils';
import { 
  Download, 
  Maximize2, 
  Minimize2,
  RefreshCw,
  Info
} from 'lucide-react';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  height?: number | string; // allow numeric or string (e.g., '40vh')
  className?: string;
  showLegend?: boolean;
  interactive?: boolean;
  loading?: boolean;
  subtitle?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  fullscreenEnabled?: boolean;
  tooltipContent?: string;
  responsive?: boolean;
  lastUpdated?: Date;
  isRefreshing?: boolean;
  isRealTimeEnabled?: boolean;
  showDataFreshness?: boolean;
}

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 8
      });
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none"
            style={{
              left: position.x,
              top: position.y,
              transform: 'translateX(-50%) translateY(-100%)'
            }}
          >
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ...existing code above...
const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  children,
  height = '300px', // default to string for CSS
  className,
  showLegend = true,
  interactive = true,
  loading = false,
  subtitle,
  onRefresh,
  onExport,
  fullscreenEnabled = false,
  tooltipContent,
  lastUpdated,
  isRefreshing = false,
  isRealTimeEnabled = true,
  showDataFreshness = false,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const chartVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1
    },
    hover: {
      scale: interactive ? 1.02 : 1
    }
  };

  const contentVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.9 
    },
    animate: { 
      opacity: 1, 
      scale: 1
    }
  };

  const loadingVariants = {
    animate: {
      rotate: 360
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        variants={chartVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={cn(
          "w-full relative",
          isFullscreen && "fixed inset-4 z-50 bg-background rounded-lg shadow-2xl",
          className
        )}
        style={!isFullscreen ? {
          minHeight: typeof height === 'number' ? `${height}px` : (height === 'auto' ? "450px" : height), // Better height handling
        } : undefined}
      >
        <MagicCard
          className={cn(
            "border-0 shadow-lg bg-card/50 backdrop-blur-sm transition-all duration-300 relative overflow-visible flex flex-col",
            interactive && "hover:shadow-xl hover:bg-card/60"
          )}
        >
          {/* Enhanced magical background effects */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-visible">
            {/* Animated gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/6"
              animate={{
                opacity: [0.02, 0.05, 0.02],
                scale: [1, 1.01, 1]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Floating micro-particles */}
            {interactive && [...Array(4)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-0.5 h-0.5 bg-primary/30 rounded-full"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${30 + (i % 2) * 40}%`
                }}
                animate={{
                  x: [0, 15, -10, 0],
                  y: [0, -20, 10, 0],
                  opacity: [0.1, 0.4, 0.2, 0.1],
                  scale: [0.8, 1.2, 0.9, 0.8]
                }}
                transition={{
                  duration: 8 + i * 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
              />
            ))}
            
            {/* Border shimmer effect */}
            <motion.div
              className="absolute inset-0 border border-primary/10 rounded-lg"
              animate={{
                borderColor: [
                  "rgba(59,130,246,0.1)",
                  "rgba(139,92,246,0.1)",
                  "rgba(34,197,94,0.1)",
                  "rgba(59,130,246,0.1)"
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          {/* Removed BorderBeam to fix chart display issues */}
          <CardHeader className={cn(
            "px-6 py-5 pb-4 flex flex-col space-y-2",
            isFullscreen && "px-8 py-6 pb-6"
          )}>
            <div className="flex flex-row items-center justify-between space-y-0">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className={cn(
                    "font-semibold text-foreground tracking-tight",
                    isFullscreen ? "text-xl" : "text-lg"
                  )}>
                    {title}
                  </CardTitle>
                  {tooltipContent && (
                    <Tooltip content={tooltipContent}>
                      <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                    </Tooltip>
                  )}
                </div>
                {subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
              
              <AnimatePresence>
                {(interactive && (isHovered || isFullscreen)) && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1"
                  >
                    {onRefresh && (
                      <Tooltip content="Refresh data">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onRefresh}
                          className="h-8 w-8 p-0"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </Tooltip>
                    )}
                    
                    {onExport && (
                      <Tooltip content="Export chart">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onExport}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </Tooltip>
                    )}
                    
                    {fullscreenEnabled && (
                      <Tooltip content={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleFullscreen}
                          className="h-8 w-8 p-0"
                        >
                          {isFullscreen ? (
                            <Minimize2 className="w-4 h-4" />
                          ) : (
                            <Maximize2 className="w-4 h-4" />
                          )}
                        </Button>
                      </Tooltip>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Data Freshness Indicator */}
            {showDataFreshness && lastUpdated && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <DataFreshnessIndicator
                  lastUpdated={lastUpdated}
                  isRefreshing={isRefreshing}
                  isRealTimeEnabled={isRealTimeEnabled}
                  onToggleRealTime={() => {}} // No-op for individual charts
                  onForceRefresh={onRefresh || (() => {})}
                  showControls={false}
                  compact={true}
                />
              </motion.div>
            )}
          </CardHeader>
          
          <CardContent className={cn(
            "px-6 py-4 flex-1",
            isFullscreen && "px-8 py-6"
          )}>
            {/* Flexible height chart wrapper - ensure proper visibility */}
            <div className="w-full relative flex flex-col" style={{
              height: isFullscreen
                ? 'calc(100vh - 250px)'
                : typeof height === 'number' ? `${height}px` : (height === 'auto' ? '450px' : height),
              minHeight: isFullscreen
                ? 'calc(100vh - 250px)'
                : typeof height === 'number' ? `${height}px` : (height === 'auto' ? '450px' : height)
            }}>
              {loading ? (
                <div className="flex items-center justify-center w-full h-full min-h-[300px]">
                  <motion.div
                    variants={loadingVariants}
                    animate="animate"
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                  />
                  <span className="ml-3 text-sm text-muted-foreground">
                    Loading chart data...
                  </span>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col">
                  {children}
                </div>
              )}
            </div>
            
            {showLegend && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="mt-4 flex flex-wrap gap-2 justify-center"
              >
                {/* Legend will be populated by individual chart components */}
              </motion.div>
            )}
          </CardContent>
        </MagicCard>
        
        {/* Fullscreen overlay backdrop */}
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10"
            onClick={toggleFullscreen}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ChartContainer;