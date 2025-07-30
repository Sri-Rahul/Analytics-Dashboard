"use client";

import React from "react";
import { motion } from "motion/react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "shimmer" | "premium" | "gradient";
  showBorder?: boolean;
  gradientColors?: string[];
  size?: "default" | "sm" | "lg" | "icon";
}

export const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    children, 
    className, 
    variant = "default", 
    showBorder = false,
    gradientColors = ["#3b82f6", "#8b5cf6"],
    size = "default",
    ...props 
  }, ref) => {
    
    if (variant === "shimmer") {
      return (
        <ShimmerButton
          ref={ref}
          className={cn("relative overflow-hidden", className)}
          {...props}
        >
          {children}
        </ShimmerButton>
      );
    }

    if (variant === "premium") {
      return (
        <motion.div
          className="relative inline-block"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            ref={ref}
            className={cn(
              "relative overflow-hidden",
              "bg-gradient-to-r from-primary via-primary to-primary",
              "hover:from-primary/90 hover:via-primary hover:to-primary/90",
              "shadow-lg hover:shadow-xl transition-all duration-300",
              "border border-primary/20",
              className
            )}
            {...props}
          >
            {children}
          </Button>
          {showBorder && (
            <BorderBeam
              size={120}
              duration={4}
              borderWidth={1}
              colorFrom="var(--primary)"
              colorTo="var(--primary)"
              className="opacity-60"
            />
          )}
        </motion.div>
      );
    }

    if (variant === "gradient") {
      return (
        <motion.div
          className="relative inline-block"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            ref={ref}
            className={cn(
              "relative overflow-hidden",
              "bg-gradient-to-r text-white border-0",
              "shadow-lg hover:shadow-xl transition-all duration-300",
              "before:absolute before:inset-0 before:bg-gradient-to-r before:opacity-0 hover:before:opacity-100 before:transition-opacity",
              className
            )}
            style={{
              background: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`,
            }}
            {...props}
          >
            <span className="relative z-10">{children}</span>
          </Button>
        </motion.div>
      );
    }

    // Default enhanced button
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          ref={ref}
          className={cn(
            "relative transition-all duration-200",
            "hover:shadow-md active:shadow-sm",
            className
          )}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";
