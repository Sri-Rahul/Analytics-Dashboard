"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ResponsiveChartProps {
  children: React.ReactNode
  title: string
  className?: string
  aspectRatio?: "square" | "video" | "wide" | "tall"
  minHeight?: number
  maxHeight?: number
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video", // 16:9
  wide: "aspect-[21/9]", // Ultra-wide
  tall: "aspect-[9/16]"   // Portrait
}

export function ResponsiveChart({
  children,
  title,
  className,
  aspectRatio = "video",
  minHeight = 200,
  maxHeight = 500
}: ResponsiveChartProps) {
  const [containerSize, setContainerSize] = React.useState({ width: 0, height: 0 })
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setContainerSize({ width, height })
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Calculate responsive height based on screen size
  const getResponsiveHeight = () => {
    if (typeof window === 'undefined') return minHeight

    const screenWidth = window.innerWidth
    
    if (screenWidth < 640) { // Mobile
      return Math.max(minHeight, Math.min(250, maxHeight))
    } else if (screenWidth < 1024) { // Tablet
      return Math.max(minHeight, Math.min(350, maxHeight))
    } else { // Desktop
      return Math.max(minHeight, Math.min(maxHeight, screenWidth * 0.25))
    }
  }

  const responsiveHeight = getResponsiveHeight()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("w-full", className)}
    >
      <Card className="h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div
            ref={containerRef}
            className={cn(
              "w-full relative overflow-hidden",
              aspectRatio && aspectRatioClasses[aspectRatio]
            )}
            style={{
              minHeight: `${minHeight}px`,
              height: aspectRatio ? undefined : `${responsiveHeight}px`
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {children}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface ResponsiveGridLayoutProps {
  children: React.ReactNode
  className?: string
  breakpoints?: {
    sm?: string
    md?: string
    lg?: string
    xl?: string
  }
}

export function ResponsiveGridLayout({
  children,
  className,
  breakpoints = {
    sm: "grid-cols-1",
    md: "md:grid-cols-2", 
    lg: "lg:grid-cols-3",
    xl: "xl:grid-cols-4"
  }
}: ResponsiveGridLayoutProps) {
  return (
    <div className={cn(
      "grid gap-4 sm:gap-6",
      breakpoints.sm,
      breakpoints.md,
      breakpoints.lg,
      breakpoints.xl,
      className
    )}>
      {children}
    </div>
  )
}

interface AdaptiveContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  padding?: {
    mobile?: string
    tablet?: string
    desktop?: string
  }
}

export function AdaptiveContainer({
  children,
  className,
  maxWidth = "2xl",
  padding = {
    mobile: "px-4",
    tablet: "sm:px-6 md:px-8",
    desktop: "lg:px-12 xl:px-16"
  }
}: AdaptiveContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg", 
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full"
  }

  return (
    <div className={cn(
      "mx-auto w-full",
      maxWidthClasses[maxWidth],
      padding.mobile,
      padding.tablet,
      padding.desktop,
      className
    )}>
      {children}
    </div>
  )
}