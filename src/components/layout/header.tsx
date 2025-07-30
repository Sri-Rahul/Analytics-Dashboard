"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, BarChart3, TrendingUp, Users, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { KeyboardShortcuts } from "@/components/ui/keyboard-shortcuts"
import { MobileSidebar } from "./mobile-sidebar"
import { cn } from "@/lib/utils"

interface HeaderProps {
  className?: string
}

const navigationItems = [
  {
    name: "Overview",
    href: "/",
    icon: BarChart3,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: TrendingUp,
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
  },
  {
    name: "Revenue",
    href: "/revenue",
    icon: DollarSign,
  },
]

export function Header({ className }: HeaderProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false)

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false)
  }

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)} role="banner">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <Link 
            href="/" 
            className="flex items-center space-x-2" 
            onClick={closeMobileSidebar}
            aria-label="ADmyBRAND Insights - Go to dashboard home"
          >
            <motion.div
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <BarChart3 className="h-5 w-5" aria-hidden="true" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold tracking-tight">
                ADmyBRAND
              </h1>
              <p className="text-xs text-muted-foreground">
                Insights
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Main navigation" id="navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-9 px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  aria-label={`Navigate to ${item.name}`}
                >
                  <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Desktop theme toggle */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          
          {/* Keyboard shortcuts help */}
          <div className="hidden md:block">
            <KeyboardShortcuts shortcuts={[]} />
          </div>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileSidebar}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileSidebarOpen}
            aria-controls="mobile-sidebar"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={closeMobileSidebar} 
      />
    </header>
  )
}