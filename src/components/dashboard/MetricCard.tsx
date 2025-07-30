"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataStatusDot } from "@/components/dashboard/DataFreshnessIndicator";
import { MagicCard } from "@/components/ui/magic-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MetricCardProps {
  title: string;
  value: number | string;
  change: number;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  format?: "currency" | "percentage" | "number";
  className?: string;
  lastUpdated?: Date;
  isRefreshing?: boolean;
  isRealTimeEnabled?: boolean;
  showDataStatus?: boolean;
}

// Professional animated counter using Magic UI NumberTicker
const ProfessionalCounter = ({ 
  value, 
  format = "number",
  isUpdating = false
}: { 
  value: number | string; 
  format?: "currency" | "percentage" | "number";
  isUpdating?: boolean;
}) => {
  const numericValue = typeof value === "string" ? parseFloat(value) || 0 : value;

  const formatValue = (val: number) => {
    switch (format) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case "percentage":
        return `${val.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat("en-US").format(Math.round(val));
    }
  };

  // For currency and percentage, we need to handle the formatting differently
  if (format === "currency") {
    return (
      <span className="tabular-nums">
        $<NumberTicker 
          value={numericValue}
          className={cn(
            "font-bold transition-colors duration-300",
            isUpdating && "text-primary"
          )}
        />
      </span>
    );
  }

  if (format === "percentage") {
    return (
      <span className="tabular-nums">
        <NumberTicker 
          value={numericValue}
          decimalPlaces={1}
          className={cn(
            "font-bold transition-colors duration-300",
            isUpdating && "text-primary"
          )}
        />%
      </span>
    );
  }

  return (
    <NumberTicker 
      value={numericValue}
      className={cn(
        "font-bold tabular-nums transition-colors duration-300",
        isUpdating && "text-primary"
      )}
    />
  );
};

export function MetricCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  format = "number",
  className,
  lastUpdated,
  isRefreshing = false,
  isRealTimeEnabled = true,
  showDataStatus = false,
}: MetricCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const previousValueRef = useRef(value);

  // Trigger update animation when value changes
  useEffect(() => {
    if (previousValueRef.current !== value) {
      setIsUpdating(true);
      previousValueRef.current = value;
      
      const timer = setTimeout(() => {
        setIsUpdating(false);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [value]);

  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600 dark:text-green-400";
      case "negative":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getChangeIcon = () => {
    if (changeType === "positive") return "↗";
    if (changeType === "negative") return "↘";
    return "→";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isUpdating ? [1, 1.01, 1] : 1
      }}
      transition={{ 
        duration: 0.4,
        ease: "easeOut",
        scale: { duration: 0.6, ease: "easeInOut" }
      }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className={cn("h-full", className)}
    >
      <MagicCard
        className={cn(
          "h-full transition-all duration-300 cursor-pointer relative overflow-hidden",
          "min-h-[140px] p-6 backdrop-blur-sm", 
          "border border-neutral-200 dark:border-neutral-800",
          "bg-white/50 dark:bg-neutral-900/50",
          "hover:shadow-xl hover:shadow-neutral-200/20 dark:hover:shadow-neutral-800/20",
          "active:scale-[0.99] touch-manipulation",
          isUpdating && "shadow-lg shadow-primary/10"
        )}
        gradientSize={300}
        gradientColor="var(--primary)"
        gradientOpacity={0.1}
        role="article"
        aria-labelledby={`metric-${title.replace(/\s+/g, '-').toLowerCase()}-title`}
        aria-describedby={`metric-${title.replace(/\s+/g, '-').toLowerCase()}-change`}
        tabIndex={0}
      >
        {/* Removed BorderBeam animation on update to fix odd circle appearance */}
        
        {/* Header */}
        <div className="flex flex-row items-center justify-between mb-4">
          <h3 
            id={`metric-${title.replace(/\s+/g, '-').toLowerCase()}-title`}
            className="text-sm font-medium text-muted-foreground flex items-center gap-2"
          >
            {title}
            {showDataStatus && lastUpdated && (
              <DataStatusDot
                lastUpdated={lastUpdated}
                isRefreshing={isRefreshing}
                isRealTimeEnabled={isRealTimeEnabled}
              />
            )}
          </h3>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            animate={isUpdating ? { 
              scale: [1, 1.2, 1],
              rotate: [0, 10, 0]
            } : {}}
            transition={{ duration: 0.3 }}
            className={cn(
              "p-2 rounded-lg transition-colors duration-200",
              "bg-neutral-100 dark:bg-neutral-800",
              isUpdating && "bg-primary/10 dark:bg-primary/10"
            )}
          >
            <Icon 
              className={cn(
                "h-5 w-5 text-muted-foreground transition-colors duration-200",
                isUpdating && "text-primary"
              )}
              aria-hidden="true"
            />
          </motion.div>
        </div>

        {/* Main Value */}
        <div className="mb-3">
          <motion.div 
            className="text-3xl font-bold tracking-tight"
            animate={isUpdating ? {
              scale: [1, 1.02, 1]
            } : {}}
            transition={{ duration: 0.4 }}
            aria-live="polite"
            aria-atomic="true"
          >
            <ProfessionalCounter value={value} format={format} isUpdating={isUpdating} />
          </motion.div>
        </div>

        {/* Change Indicator */}
        <motion.div 
          id={`metric-${title.replace(/\s+/g, '-').toLowerCase()}-change`}
          className={cn(
            "text-sm flex items-center gap-2 px-2 py-1 rounded-md",
            "bg-neutral-50 dark:bg-neutral-800/50",
            getChangeColor()
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          aria-live="polite"
        >
          <motion.span 
            className={cn(
              "inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium",
              changeType === "positive" && "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
              changeType === "negative" && "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
              changeType === "neutral" && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
            )}
            animate={isUpdating ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.4 }}
            aria-hidden="true"
          >
            {getChangeIcon()}
          </motion.span>
          <span className="font-medium">
            {Math.abs(change).toFixed(1)}% {changeType === "positive" ? "increase" : changeType === "negative" ? "decrease" : "change"}
          </span>
        </motion.div>
      </MagicCard>
    </motion.div>
  );
}