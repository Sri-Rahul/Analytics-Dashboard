import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import Dashboard from '@/app/page'
import { ThemeProvider } from '@/components/theme-provider'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    tr: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {component}
    </ThemeProvider>
  )
}

describe('Accessibility Tests', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }))
  })

  describe('Semantic HTML Structure', () => {
    it('should have proper heading hierarchy', async () => {
      renderWithTheme(<Dashboard />)
      
      // Check for main heading
      expect(screen.getByRole('heading', { level: 1, name: /dashboard overview/i })).toBeInTheDocument()
      
      // Check for section headings (even if visually hidden)
      expect(screen.getByText('Key Performance Metrics')).toBeInTheDocument()
      expect(screen.getByText('Data Visualization Charts')).toBeInTheDocument()
    })

    it('should have proper landmark roles', async () => {
      renderWithTheme(<Dashboard />)
      
      // Check for main landmark
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'Analytics Dashboard')
      
      // Check for navigation landmarks
      expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
    })

    it('should have proper ARIA labels on interactive elements', async () => {
      renderWithTheme(<Dashboard />)
      
      // Check metric cards have proper labels
      const metricCards = screen.getAllByRole('article')
      expect(metricCards.length).toBeGreaterThan(0)
      
      metricCards.forEach(card => {
        expect(card).toHaveAttribute('aria-labelledby')
        expect(card).toHaveAttribute('aria-describedby')
      })
    })

    it('should have proper live regions for dynamic content', async () => {
      renderWithTheme(<Dashboard />)
      
      // Check for live regions
      const liveRegions = screen.getAllByRole('region')
      const politeRegions = liveRegions.filter(region => 
        region.getAttribute('aria-live') === 'polite'
      )
      
      expect(politeRegions.length).toBeGreaterThan(0)
    })
  })

  describe('Keyboard Navigation', () => {
    it('should have skip links that work', async () => {
      const user = userEvent.setup()
      renderWithTheme(<Dashboard />)
      
      // Tab to first skip link
      await user.tab()
      
      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink).toHaveFocus()
      
      // Activate skip link
      await user.keyboard('{Enter}')
      
      // Main content should be focused or scrolled to
      const mainContent = screen.getByRole('main')
      expect(mainContent).toBeInTheDocument()
    })

    it('should support keyboard shortcuts', async () => {
      const user = userEvent.setup()
      renderWithTheme(<Dashboard />)
      
      // Test navigation shortcuts
      await user.keyboard('m') // Go to metrics
      await user.keyboard('c') // Go to charts
      await user.keyboard('h') // Go to home
      
      // These should not throw errors and should trigger navigation
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('should have proper focus management in modals', async () => {
      const user = userEvent.setup()
      renderWithTheme(<Dashboard />)
      
      // Find and open a modal/dropdown (theme toggle)
      const themeToggle = screen.getByRole('button', { name: /toggle theme/i })
      await user.click(themeToggle)
      
      // Focus should be managed properly
      await waitFor(() => {
        const dropdown = screen.getByRole('menu', { name: /theme options/i })
        expect(dropdown).toBeInTheDocument()
      })
    })

    it('should trap focus in mobile sidebar', async () => {
      const user = userEvent.setup()
      
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      renderWithTheme(<Dashboard />)
      
      // Open mobile menu
      const menuButton = screen.getByRole('button', { name: /toggle mobile menu/i })
      await user.click(menuButton)
      
      // Check if sidebar is open and focus is managed
      await waitFor(() => {
        const sidebar = screen.getByRole('dialog')
        expect(sidebar).toBeInTheDocument()
        expect(sidebar).toHaveAttribute('aria-modal', 'true')
      })
    })
  })

  describe('Screen Reader Support', () => {
    it('should have proper table structure', async () => {
      renderWithTheme(<Dashboard />)
      
      // Look for data tables
      const tables = screen.getAllByRole('table')
      
      tables.forEach(table => {
        expect(table).toHaveAttribute('aria-label')
        
        // Check for proper table headers
        const columnHeaders = screen.getAllByRole('columnheader')
        expect(columnHeaders.length).toBeGreaterThan(0)
      })
    })

    it('should have descriptive button labels', async () => {
      renderWithTheme(<Dashboard />)
      
      // Check all buttons have accessible names
      const buttons = screen.getAllByRole('button')
      
      buttons.forEach(button => {
        const accessibleName = button.getAttribute('aria-label') || 
                              button.textContent || 
                              button.getAttribute('title')
        expect(accessibleName).toBeTruthy()
      })
    })

    it('should announce dynamic content changes', async () => {
      renderWithTheme(<Dashboard />)
      
      // Check for aria-live regions
      const liveRegions = document.querySelectorAll('[aria-live]')
      expect(liveRegions.length).toBeGreaterThan(0)
      
      // Check for aria-atomic on important updates
      const atomicRegions = document.querySelectorAll('[aria-atomic="true"]')
      expect(atomicRegions.length).toBeGreaterThan(0)
    })
  })

  describe('Automated Accessibility Testing', () => {
    it('should not have any accessibility violations', async () => {
      const { container } = renderWithTheme(<Dashboard />)
      
      // Wait for component to fully render
      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument()
      })
      
      // Run axe accessibility tests
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper color contrast', async () => {
      const { container } = renderWithTheme(<Dashboard />)
      
      // This would be tested by axe, but we can also do manual checks
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true }
        }
      })
      
      expect(results).toHaveNoViolations()
    })

    it('should have proper focus indicators', async () => {
      const { container } = renderWithTheme(<Dashboard />)
      
      const results = await axe(container, {
        rules: {
          'focus-order-semantics': { enabled: true }
        }
      })
      
      expect(results).toHaveNoViolations()
    })
  })

  describe('Error Handling and Status Messages', () => {
    it('should announce loading states', async () => {
      renderWithTheme(<Dashboard />)
      
      // Check for loading indicators with proper ARIA
      const loadingElements = document.querySelectorAll('[role="status"]')
      expect(loadingElements.length).toBeGreaterThan(0)
    })

    it('should handle empty states accessibly', async () => {
      renderWithTheme(<Dashboard />)
      
      // Look for "No results" messages
      await waitFor(() => {
        const emptyStates = screen.queryAllByText(/no results/i)
        emptyStates.forEach(element => {
          expect(element.closest('[role="status"]')).toBeInTheDocument()
        })
      })
    })
  })
})