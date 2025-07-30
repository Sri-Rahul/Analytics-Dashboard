"use client"

import * as React from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterChipProps {
  label: string
  value: string
  onRemove: () => void
  className?: string
}

export function FilterChip({ label, value, onRemove, className }: FilterChipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: -20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("inline-flex items-center", className)}
    >
      <Badge variant="secondary" className="pr-1 gap-1">
        <span className="text-xs font-medium">
          {label}: {value}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
          onClick={onRemove}
          aria-label={`Remove ${label} filter`}
        >
          <X className="h-3 w-3" />
        </Button>
      </Badge>
    </motion.div>
  )
}

interface FilterChipsContainerProps {
  children: React.ReactNode
  className?: string
}

export function FilterChipsContainer({ children, className }: FilterChipsContainerProps) {
  return (
    <AnimatePresence mode="popLayout">
      <div className={cn("flex flex-wrap gap-2", className)}>
        {children}
      </div>
    </AnimatePresence>
  )
}