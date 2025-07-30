"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SkipLink {
  href: string
  label: string
}

interface SkipLinksProps {
  links?: SkipLink[]
  className?: string
}

const defaultLinks: SkipLink[] = [
  { href: "#main-content", label: "Skip to main content" },
  { href: "#navigation", label: "Skip to navigation" },
  { href: "#metrics", label: "Skip to metrics" },
  { href: "#charts", label: "Skip to charts" },
]

export function SkipLinks({ links = defaultLinks, className }: SkipLinksProps) {
  return (
    <div className={cn("sr-only focus-within:not-sr-only", className)}>
      <nav aria-label="Skip links">
        <ul className="fixed top-0 left-0 z-[9999] flex flex-col gap-1 p-2 bg-background border border-border rounded-md shadow-lg">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  "inline-flex items-center justify-center rounded-md text-sm font-medium",
                  "h-10 px-4 py-2",
                  "bg-primary text-primary-foreground",
                  "hover:bg-primary/90",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "transition-colors"
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    const target = document.querySelector(link.href)
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth" })
                      // Focus the target element if it's focusable
                      if (target instanceof HTMLElement && target.tabIndex >= 0) {
                        target.focus()
                      }
                    }
                  }
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}