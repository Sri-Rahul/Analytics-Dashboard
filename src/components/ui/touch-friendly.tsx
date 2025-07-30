"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TouchFriendlyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "default" | "ghost" | "outline"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function TouchFriendlyButton({ 
  children, 
  variant = "default",
  size = "md",
  className,
  ...props 
}: TouchFriendlyButtonProps) {
  const baseClasses = "relative inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80"
  }
  
  const sizeClasses = {
    sm: "h-10 px-4 py-2 text-sm min-w-[2.5rem]", // 40px minimum height for touch
    md: "h-12 px-6 py-3 text-base min-w-[3rem]", // 48px minimum height for touch
    lg: "h-14 px-8 py-4 text-lg min-w-[3.5rem]" // 56px minimum height for touch
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}

interface TouchFriendlyCardProps {
  children: React.ReactNode
  className?: string
  onTap?: () => void
  interactive?: boolean
}

export function TouchFriendlyCard({ 
  children, 
  className,
  onTap,
  interactive = false
}: TouchFriendlyCardProps) {
  const Component = onTap ? motion.div : "div"
  
  const cardProps = onTap ? {
    whileTap: { scale: 0.98 },
    transition: { duration: 0.1 },
    onClick: onTap,
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer",
      "hover:shadow-md active:shadow-sm transition-shadow duration-200",
      "min-h-[44px] p-4", // Minimum touch target size
      className
    )
  } : {
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      "min-h-[44px] p-4",
      className
    )
  }

  return <Component {...cardProps}>{children}</Component>
}

interface SwipeableContainerProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  className?: string
  threshold?: number
}

export function SwipeableContainer({ 
  children, 
  onSwipeLeft,
  onSwipeRight,
  className,
  threshold = 50
}: SwipeableContainerProps) {
  const [dragStart, setDragStart] = React.useState<number | null>(null)

  const handleDragStart = (event: any, info: any) => {
    setDragStart(info.point.x)
  }

  const handleDragEnd = (event: any, info: any) => {
    if (dragStart === null) return

    const dragDistance = info.point.x - dragStart
    
    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (dragDistance < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    }
    
    setDragStart(null)
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn("touch-pan-x", className)}
    >
      {children}
    </motion.div>
  )
}

interface TouchFriendlySliderProps {
  value: number
  onValueChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
  label?: string
}

export function TouchFriendlySlider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  label
}: TouchFriendlySliderProps) {
  const sliderRef = React.useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const handlePointerDown = (event: React.PointerEvent) => {
    setIsDragging(true)
    updateValue(event)
  }

  const handlePointerMove = (event: React.PointerEvent) => {
    if (isDragging) {
      updateValue(event)
    }
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  const updateValue = (event: React.PointerEvent) => {
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
    const newValue = Math.round((min + percentage * (max - min)) / step) * step
    onValueChange(Math.max(min, Math.min(max, newValue)))
  }

  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}: {value}
        </label>
      )}
      <div
        ref={sliderRef}
        className="relative h-12 w-full cursor-pointer touch-none select-none" // Increased height for touch
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Track */}
        <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-secondary" />
        
        {/* Progress */}
        <div 
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-primary transition-all duration-150"
          style={{ width: `${percentage}%` }}
        />
        
        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-lg border-2 border-background"
          style={{ left: `${percentage}%` }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ scale: isDragging ? 1.2 : 1 }}
        />
      </div>
    </div>
  )
}