"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, BarChart3, TrendingUp, Users, DollarSign, Settings, HelpCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { keyboardUtils } from "@/hooks/useKeyboardNavigation"
import { cn } from "@/lib/utils"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

const navigationItems = [
  {
    name: "Overview",
    href: "/",
    icon: BarChart3,
    description: "Dashboard overview and key metrics"
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: TrendingUp,
    description: "Detailed analytics and insights"
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
    description: "User management and activity"
  },
  {
    name: "Revenue",
    href: "/revenue",
    icon: DollarSign,
    description: "Revenue tracking and reports"
  },
]

const secondaryItems = [
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    name: "Help",
    href: "/help",
    icon: HelpCircle,
  },
  {
    name: "Sign Out",
    href: "/logout",
    icon: LogOut,
  },
]

export function MobileSidebar({ isOpen, onClose, className }: MobileSidebarProps) {
  // Close sidebar when clicking outside
  const sidebarRef = React.useRef<HTMLDivElement>(null)
  const closeButtonRef = React.useRef<HTMLButtonElement>(null)
  const previousFocusRef = React.useRef<HTMLElement | null>(null)
  
  // Focus management
  React.useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement
      
      // Focus the close button when sidebar opens
      setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 100)
      
      // Set up focus trap
      const cleanup = sidebarRef.current ? keyboardUtils.trapFocus(sidebarRef.current) : undefined
      
      return cleanup
    } else {
      // Restore focus to the previously focused element when sidebar closes
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  // Close sidebar on escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            ref={sidebarRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 200,
              duration: 0.3 
            }}
            className={cn(
              "fixed left-0 top-0 z-50 h-full w-80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border-r shadow-lg md:hidden",
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-sidebar-title"
            id="mobile-sidebar"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b px-6 py-4">
                <Link href="/" className="flex items-center space-x-3" onClick={onClose}>
                  <motion.div
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BarChart3 className="h-6 w-6" />
                  </motion.div>
                  <div>
                    <h1 id="mobile-sidebar-title" className="text-lg font-semibold tracking-tight">
                      ADmyBRAND
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Insights Dashboard
                    </p>
                  </div>
                </Link>
                
                <Button
                  ref={closeButtonRef}
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto px-4 py-6" role="navigation" aria-label="Mobile navigation">
                <div className="space-y-2">
                  <div className="mb-6">
                    <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Navigation
                    </h2>
                    <div className="space-y-1">
                      {navigationItems.map((item, index) => {
                        const Icon = item.icon
                        return (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                              duration: 0.3, 
                              delay: index * 0.1,
                              ease: [0.4, 0, 0.2, 1] 
                            }}
                          >
                            <Link href={item.href} onClick={onClose}>
                              <Button
                                variant="ghost"
                                className="w-full justify-start h-auto p-3 text-left hover:bg-accent/50"
                              >
                                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-xs text-muted-foreground truncate">
                                    {item.description}
                                  </div>
                                </div>
                              </Button>
                            </Link>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Account
                    </h2>
                    <div className="space-y-1">
                      {secondaryItems.map((item, index) => {
                        const Icon = item.icon
                        return (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                              duration: 0.3, 
                              delay: (navigationItems.length + index) * 0.1,
                              ease: [0.4, 0, 0.2, 1] 
                            }}
                          >
                            <Link href={item.href} onClick={onClose}>
                              <Button
                                variant="ghost"
                                className="w-full justify-start h-10 px-3 text-sm font-medium hover:bg-accent/50"
                              >
                                <Icon className="mr-3 h-4 w-4" />
                                {item.name}
                              </Button>
                            </Link>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </nav>

              {/* Footer */}
              <div className="border-t px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Theme
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}