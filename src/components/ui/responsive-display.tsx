"use client"

import { useEffect, useState } from "react"
import { ClientOnly } from "./client-only"

interface ResponsiveDisplayProps {
  children: React.ReactNode
  showOn: 'mobile' | 'tablet' | 'desktop' | 'mobile-tablet' | 'tablet-desktop'
  fallback?: React.ReactNode
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

export function ResponsiveDisplay({ children, showOn, fallback = null }: ResponsiveDisplayProps) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const shouldShow = () => {
    switch (showOn) {
      case 'mobile':
        return isMobile
      case 'tablet':
        return isTablet
      case 'desktop':
        return isDesktop
      case 'mobile-tablet':
        return isMobile || isTablet
      case 'tablet-desktop':
        return isTablet || isDesktop
      default:
        return true
    }
  }

  return (
    <ClientOnly fallback={fallback}>
      {shouldShow() ? children : null}
    </ClientOnly>
  )
}

// Utility hooks for responsive behavior
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)')
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)')
}