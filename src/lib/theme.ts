// Theme configuration and utilities

export const themeConfig = {
  colors: {
    primary: {
      50: 'var(--primary-50)',
      500: 'var(--primary-500)',
      900: 'var(--primary-900)',
    },
    success: {
      50: 'var(--success-50)',
      500: 'var(--success-500)',
      900: 'var(--success-900)',
    },
    warning: {
      50: 'var(--warning-50)',
      500: 'var(--warning-500)',
      900: 'var(--warning-900)',
    },
    error: {
      50: 'var(--error-50)',
      500: 'var(--error-500)',
      900: 'var(--error-900)',
    },
  },
  spacing: {
    1: 'var(--spacing-1)',
    2: 'var(--spacing-2)',
    3: 'var(--spacing-3)',
    4: 'var(--spacing-4)',
    5: 'var(--spacing-5)',
    6: 'var(--spacing-6)',
    7: 'var(--spacing-7)',
    8: 'var(--spacing-8)',
  },
  animation: {
    duration: {
      fast: 'var(--animation-duration-fast)',
      normal: 'var(--animation-duration-normal)',
      slow: 'var(--animation-duration-slow)',
    },
    easing: 'var(--animation-easing)',
  },
};

export type ThemeConfig = typeof themeConfig;

// Theme utilities
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const watchSystemTheme = (callback: (theme: 'light' | 'dark') => void) => {
  if (typeof window === 'undefined') return () => {}
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light')
  }
  
  mediaQuery.addEventListener('change', handler)
  return () => mediaQuery.removeEventListener('change', handler)
}

// Theme transition utilities
export const enableThemeTransition = () => {
  if (typeof document === 'undefined') return
  
  const css = document.createElement('style')
  css.appendChild(
    document.createTextNode(
      `*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`
    )
  )
  document.head.appendChild(css)
  
  return () => {
    // Force reflow
    ;(() => window.getComputedStyle(document.body))()
    
    // Re-enable transitions
    document.head.removeChild(css)
  }
}

export const applyThemeTransition = () => {
  if (typeof document === 'undefined') return
  
  const disableTransition = enableThemeTransition()
  
  // Re-enable transitions after a brief delay
  setTimeout(() => {
    disableTransition()
  }, 1)
}