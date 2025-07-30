"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Keyboard, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
  description: string
  category?: string
}

interface KeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[]
  className?: string
}

const KeyCombination = ({ shortcut }: { shortcut: KeyboardShortcut }) => {
  const keys = []
  
  if (shortcut.ctrlKey) keys.push("Ctrl")
  if (shortcut.altKey) keys.push("Alt")
  if (shortcut.shiftKey) keys.push("Shift")
  if (shortcut.metaKey) keys.push("Cmd")
  keys.push(shortcut.key.toUpperCase())

  return (
    <div className="flex items-center gap-1">
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          <Badge variant="outline" className="px-2 py-1 text-xs font-mono">
            {key}
          </Badge>
          {index < keys.length - 1 && (
            <span className="text-muted-foreground text-xs">+</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export function KeyboardShortcuts({ shortcuts, className }: KeyboardShortcutsProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || "General"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(shortcut)
    return acc
  }, {} as Record<string, KeyboardShortcut[]>)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("relative", className)}
          aria-label="Show keyboard shortcuts"
          title="Keyboard shortcuts (Press ? to toggle)"
        >
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate the dashboard more efficiently.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                {category}
              </h3>
              <div className="space-y-2">
                {categoryShortcuts.map((shortcut, index) => (
                  <motion.div
                    key={`${category}-${index}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <span className="text-sm text-foreground">
                      {shortcut.description}
                    </span>
                    <KeyCombination shortcut={shortcut} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> Press <Badge variant="outline" className="mx-1 px-2 py-1 text-xs font-mono">?</Badge> 
            at any time to toggle this help dialog.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook to show/hide shortcuts dialog with ? key
export function useKeyboardShortcutsDialog() {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "?" && !event.ctrlKey && !event.altKey && !event.metaKey) {
        // Don't trigger when user is typing in input fields
        const target = event.target as HTMLElement
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.contentEditable === "true"
        ) {
          return
        }
        
        event.preventDefault()
        setIsOpen(prev => !prev)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return { isOpen, setIsOpen }
}