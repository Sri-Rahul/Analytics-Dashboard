"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Pause,
  Play,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DataFreshnessIndicatorProps {
  lastUpdated: Date;
  isRefreshing: boolean;
  isRealTimeEnabled: boolean;
  onToggleRealTime: () => void;
  onForceRefresh: () => void;
  className?: string;
  showControls?: boolean;
  compact?: boolean;
}

export function DataFreshnessIndicator({
  lastUpdated,
  isRefreshing,
  isRealTimeEnabled,
  onToggleRealTime,
  onForceRefresh,
  className,
  showControls = true,
  compact = false
}: DataFreshnessIndicatorProps) {
  const getTimeSinceUpdate = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    }
  };

  const getDataStatus = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
    
    if (isRefreshing) return 'updating';
    if (!isRealTimeEnabled) return 'paused';
    if (diffInSeconds < 30) return 'fresh';
    if (diffInSeconds < 300) return 'recent'; // 5 minutes
    return 'stale';
  };

  const status = getDataStatus();

  const statusConfig = {
    updating: {
      color: 'bg-blue-500',
      icon: RefreshCw,
      label: 'Live',
      pulse: true
    },
    fresh: {
      color: 'bg-green-500',
      icon: CheckCircle,
      label: 'Live',
      pulse: true
    },
    recent: {
      color: 'bg-yellow-500',
      icon: Clock,
      label: 'Recent',
      pulse: false
    },
    stale: {
      color: 'bg-red-500',
      icon: AlertCircle,
      label: 'Stale',
      pulse: false
    },
    paused: {
      color: 'bg-gray-500',
      icon: Pause,
      label: 'Paused',
      pulse: false
    }
  };

  const config = statusConfig[status];

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div 
              className={cn("flex items-center gap-3", className)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <motion.div
                  className={cn("w-2.5 h-2.5 rounded-full", config.color)}
                  animate={config.pulse ? { 
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.7, 1]
                  } : {}}
                  transition={{ 
                    duration: 2, 
                    repeat: config.pulse ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                />
                {/* Subtle glow for compact version */}
                {config.pulse && (
                  <motion.div
                    className={cn("absolute inset-0 rounded-full blur-sm opacity-40", config.color)}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 0.1, 0.4]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </div>
              <motion.span 
                className="text-xs text-muted-foreground font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {getTimeSinceUpdate()}
              </motion.span>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent className="border border-border/20 bg-background/95 backdrop-blur-sm">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="font-medium flex items-center gap-2">
                <config.icon className="h-3 w-3" />
                {config.label}
              </div>
              <div className="text-xs text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </motion.div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02, y: -1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "inline-flex items-center gap-4 px-5 py-3 rounded-xl",
              "bg-gradient-to-r from-background/80 via-background/90 to-background/80",
              "border border-border/40 backdrop-blur-md",
              "hover:border-border/60 hover:shadow-lg transition-all duration-300",
              "group cursor-pointer relative overflow-hidden",
              className
            )}
          >
            {/* Enhanced magical animated background with Magic UI effects */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none overflow-hidden">
              {/* Dynamic gradient background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
                animate={{
                  background: [
                    "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.05) 50%, rgba(34,197,94,0.1) 100%)",
                    "linear-gradient(225deg, rgba(34,197,94,0.1) 0%, rgba(59,130,246,0.05) 50%, rgba(139,92,246,0.1) 100%)",
                    "linear-gradient(315deg, rgba(139,92,246,0.1) 0%, rgba(34,197,94,0.05) 50%, rgba(59,130,246,0.1) 100%)",
                  ],
                  x: ['-100%', '100%']
                }}
                transition={{
                  background: {
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  x: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              />
              
              {/* Professional data flow particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`data-particle-${i}`}
                  className="absolute w-1 h-1 bg-primary/40 rounded-full"
                  style={{
                    left: `${10 + i * 8}%`,
                    top: `${15 + (i % 4) * 20}%`
                  }}
                  animate={{
                    x: [0, 30, -20, 0],
                    y: [0, -35, 25, 0],
                    opacity: [0.2, 0.8, 0.3, 0.2],
                    scale: [0.6, 1.4, 0.8, 0.6]
                  }}
                  transition={{
                    duration: 6 + i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.15
                  }}
                />
              ))}
              
              {/* Activity meteors for real-time feel */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`activity-meteor-${i}`}
                  className="absolute w-16 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full"
                  style={{
                    left: `${i * 20}%`,
                    top: `${10 + i * 15}%`,
                    transform: 'rotate(35deg)'
                  }}
                  animate={{
                    x: [-40, 180],
                    opacity: [0, 1, 0],
                    scaleX: [0.5, 1.5, 0.8]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 1.5 + 1
                  }}
                />
              ))}
              
              {/* Data pulse waves */}
              <motion.div
                className="absolute inset-0 border border-primary/15 rounded-xl"
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: [0.1, 0.4, 0.1],
                  borderColor: [
                    "rgba(59,130,246,0.15)",
                    "rgba(139,92,246,0.15)",
                    "rgba(34,197,94,0.15)",
                    "rgba(59,130,246,0.15)"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Network connection lines */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`connection-${i}`}
                  className="absolute w-20 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                  style={{
                    left: `${15 + i * 25}%`,
                    top: `${25 + i * 15}%`,
                    transform: `rotate(${-15 + i * 15}deg)`
                  }}
                  animate={{
                    scaleX: [0.5, 1.2, 0.7, 0.5],
                    opacity: [0.2, 0.7, 0.4, 0.2]
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.8
                  }}
                />
              ))}
            </div>

            {/* Enhanced Status Dot with Professional Glow */}
            <div className="relative z-10">
              <motion.div
                className={cn("w-3 h-3 rounded-full relative", config.color)}
                animate={config.pulse ? { 
                  scale: [1, 1.2, 1],
                  opacity: [0.9, 1, 0.9]
                } : {}}
                transition={{ 
                  duration: 2.5, 
                  repeat: config.pulse ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                {/* Multi-layered professional glow */}
                {config.pulse && (
                  <>
                    <motion.div
                      className={cn("absolute inset-0 rounded-full", config.color, "opacity-20")}
                      animate={{
                        scale: [1, 2.5, 1],
                        opacity: [0.2, 0.05, 0.2]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className={cn("absolute inset-0 rounded-full blur-sm", config.color, "opacity-30")}
                      animate={{
                        scale: [1, 1.8, 1],
                        opacity: [0.3, 0.1, 0.3]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.3
                      }}
                    />
                    {/* Additional orbital ring */}
                    <motion.div
                      className={cn("absolute inset-0 rounded-full border", config.color, "opacity-20")}
                      animate={{
                        rotate: [0, 360],
                        scale: [1.2, 1.5, 1.2]
                      }}
                      transition={{
                        rotate: {
                          duration: 6,
                          repeat: Infinity,
                          ease: "linear"
                        },
                        scale: {
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                    />
                  </>
                )}
              </motion.div>
            </div>
            
            {/* Professional Status Label with Micro-animation */}
            <motion.div 
              className="flex flex-col gap-1 min-w-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <motion.span 
                className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200 flex items-center gap-2"
                animate={config.pulse ? {
                  opacity: [1, 0.9, 1]
                } : {}}
                transition={{
                  duration: 3,
                  repeat: config.pulse ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                <config.icon className="h-3.5 w-3.5 shrink-0" />
                {config.label}
              </motion.span>
              
              <motion.span 
                className="text-xs text-muted-foreground font-mono tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                key={getTimeSinceUpdate()} // Re-animate on time change
              >
                {getTimeSinceUpdate()}
              </motion.span>
            </motion.div>

            {/* Enhanced Controls with Micro-animations */}
            {showControls && (
              <motion.div
                className="flex items-center gap-2 ml-auto"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleRealTime();
                    }}
                    className="h-7 w-7 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200 border border-transparent hover:border-primary/20"
                  >
                    <motion.div
                      animate={isRealTimeEnabled ? { rotate: [0, 360] } : { rotate: 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      {isRealTimeEnabled ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3 ml-0.5" />
                      )}
                    </motion.div>
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* Subtle Activity Indicator */}
            {isRealTimeEnabled && !isRefreshing && (
              <motion.div
                className="absolute right-2 top-2 flex gap-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 h-0.5 bg-primary/50 rounded-full"
                    animate={{
                      y: [0, -3, 0],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="border border-border/20 bg-background/95 backdrop-blur-sm">
          <motion.div 
            className="text-center space-y-2 p-1"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="font-medium flex items-center gap-2">
              <config.icon className="h-4 w-4" />
              {config.label} Data
            </div>
            <div className="text-xs text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            {showControls && (
              <div className="text-xs text-muted-foreground border-t border-border/20 pt-1 mt-1">
                Click {isRealTimeEnabled ? 'pause' : 'play'} to {isRealTimeEnabled ? 'pause' : 'start'} updates
              </div>
            )}
          </motion.div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Simplified version for use in individual components
export function DataStatusDot({
  lastUpdated,
  isRefreshing,
  isRealTimeEnabled,
  className
}: Pick<DataFreshnessIndicatorProps, 'lastUpdated' | 'isRefreshing' | 'isRealTimeEnabled' | 'className'>) {
  const getDataStatus = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
    
    if (isRefreshing) return 'updating';
    if (!isRealTimeEnabled) return 'paused';
    if (diffInSeconds < 30) return 'fresh';
    if (diffInSeconds < 300) return 'recent';
    return 'stale';
  };

  const status = getDataStatus();
  
  const statusColors = {
    updating: 'bg-blue-500',
    fresh: 'bg-green-500',
    recent: 'bg-yellow-500',
    stale: 'bg-red-500',
    paused: 'bg-gray-500'
  };

  const shouldPulse = status === 'updating' || (status === 'fresh' && isRealTimeEnabled);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <motion.div
              className={cn(
                "w-3 h-3 rounded-full relative z-10",
                statusColors[status],
                className
              )}
              animate={shouldPulse ? { 
                scale: [1, 1.4, 1],
                opacity: [1, 0.7, 1]
              } : {}}
              transition={{ 
                duration: 2, 
                repeat: shouldPulse ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
            {/* Enhanced glow effect */}
            {shouldPulse && (
              <>
                <motion.div
                  className={cn(
                    "absolute inset-0 rounded-full blur-sm opacity-40",
                    statusColors[status]
                  )}
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.4, 0.1, 0.4]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className={cn(
                    "absolute inset-0 rounded-full blur-md opacity-20",
                    statusColors[status]
                  )}
                  animate={{
                    scale: [1, 2.5, 1],
                    opacity: [0.2, 0.05, 0.2]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
              </>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="border border-border/20 bg-background/95 backdrop-blur-sm">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="font-medium capitalize">{status}</div>
            <div className="text-xs text-muted-foreground">
              {lastUpdated.toLocaleTimeString()}
            </div>
          </motion.div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
