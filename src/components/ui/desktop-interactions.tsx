"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface HoverCardProps {
  children: React.ReactNode
  hoverContent?: React.ReactNode
  className?: string
  hoverClassName?: string
  disabled?: boolean
}

export function HoverCard({
  children,
  hoverContent,
  className,
  hoverClassName,
  disabled = false
}: HoverCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (disabled || isMobile) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={cn("relative", className)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {children}
      
      <AnimatePresence>
        {isHovered && hoverContent && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute top-full left-0 z-50 mt-2 p-4 bg-popover border rounded-lg shadow-lg",
              "min-w-[200px] max-w-[300px]",
              hoverClassName
            )}
          >
            {hoverContent}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface TooltipProps {
  children: React.ReactNode
  content: string | React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  className?: string
  disabled?: boolean
}

export function Tooltip({
  children,
  content,
  side = "top",
  className,
  disabled = false
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (disabled || isMobile) {
    return <>{children}</>
  }

  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 px-3 py-2 text-sm bg-popover border rounded-md shadow-md",
              "whitespace-nowrap pointer-events-none",
              sideClasses[side],
              className
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface ContextMenuProps {
  children: React.ReactNode
  menuItems: Array<{
    label: string
    icon?: React.ReactNode
    onClick: () => void
    disabled?: boolean
  }>
  className?: string
}

export function ContextMenu({
  children,
  menuItems,
  className
}: ContextMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  React.useEffect(() => {
    const handleClickOutside = () => setIsOpen(false)
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleContextMenu = (e: React.MouseEvent) => {
    if (isMobile) return
    
    e.preventDefault()
    setPosition({ x: e.clientX, y: e.clientY })
    setIsOpen(true)
  }

  if (isMobile) {
    return <>{children}</>
  }

  return (
    <>
      <div onContextMenu={handleContextMenu} className={className}>
        {children}
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 bg-popover border rounded-md shadow-lg py-1 min-w-[160px]"
            style={{ left: position.x, top: position.y }}
          >
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick()
                  setIsOpen(false)
                }}
                disabled={item.disabled}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground",
                  "flex items-center gap-2 transition-colors",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

interface KeyboardShortcutProps {
  keys: string[]
  onTrigger: () => void
  disabled?: boolean
}

export function KeyboardShortcut({
  keys,
  onTrigger,
  disabled = false
}: KeyboardShortcutProps) {
  React.useEffect(() => {
    if (disabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const pressedKeys = []
      
      if (e.ctrlKey || e.metaKey) pressedKeys.push('ctrl')
      if (e.shiftKey) pressedKeys.push('shift')
      if (e.altKey) pressedKeys.push('alt')
      
      const key = e.key.toLowerCase()
      if (!['control', 'shift', 'alt', 'meta'].includes(key)) {
        pressedKeys.push(key)
      }

      const keysMatch = keys.length === pressedKeys.length && 
        keys.every(k => pressedKeys.includes(k.toLowerCase()))

      if (keysMatch) {
        e.preventDefault()
        onTrigger()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [keys, onTrigger, disabled])

  return null
}

export function KeyboardShortcutDisplay({ keys }: { keys: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          {index > 0 && <span className="text-xs text-muted-foreground">+</span>}
          <kbd className="px-1.5 py-0.5 text-xs bg-muted border rounded">
            {key}
          </kbd>
        </React.Fragment>
      ))}
    </div>
  )
}