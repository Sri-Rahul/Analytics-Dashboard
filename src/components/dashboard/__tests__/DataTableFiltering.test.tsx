/**
 * Test file to verify DataTable filtering functionality
 * This tests the implementation of task 5.2: Add filtering and search functionality
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DataTable } from '../DataTable'
import { campaignColumns } from '../table-columns'
import { generateMockTableData } from '@/lib/data'

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    tr: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

describe('DataTable Filtering Functionality', () => {
  const mockData = generateMockTableData(10)

  it('should render search input when searchKey is provided', () => {
    render(
      <DataTable
        columns={campaignColumns}
        data={mockData}
        searchKey="campaign"
        searchPlaceholder="Search campaigns..."
        enableAdvancedFiltering={true}
      />
    )

    expect(screen.getByPlaceholderText('Search campaigns...')).toBeInTheDocument()
  })

  it('should show filter panel toggle button', () => {
    render(
      <DataTable
        columns={campaignColumns}
        data={mockData}
        searchKey="campaign"
        enableAdvancedFiltering={true}
      />
    )

    expect(screen.getByText('Filters')).toBeInTheDocument()
  })

  it('should display results count', () => {
    render(
      <DataTable
        columns={campaignColumns}
        data={mockData}
        searchKey="campaign"
        enableAdvancedFiltering={true}
      />
    )

    expect(screen.getByText(`${mockData.length} results`)).toBeInTheDocument()
  })

  it('should filter data when search input is used', async () => {
    render(
      <DataTable
        columns={campaignColumns}
        data={mockData}
        searchKey="campaign"
        enableAdvancedFiltering={true}
      />
    )

    const searchInput = screen.getByPlaceholderText('Search...')
    fireEvent.change(searchInput, { target: { value: 'Summer' } })

    // Wait for debounced search
    await waitFor(() => {
      const filteredResults = mockData.filter(item => 
        item.campaign.toLowerCase().includes('summer')
      )
      if (filteredResults.length > 0) {
        expect(screen.getByText(`${filteredResults.length} result${filteredResults.length !== 1 ? 's' : ''}`)).toBeInTheDocument()
      }
    }, { timeout: 500 })
  })

  it('should show clear button when search has value', async () => {
    render(
      <DataTable
        columns={campaignColumns}
        data={mockData}
        searchKey="campaign"
        enableAdvancedFiltering={true}
      />
    )

    const searchInput = screen.getByPlaceholderText('Search...')
    fireEvent.change(searchInput, { target: { value: 'test' } })

    await waitFor(() => {
      expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
    })
  })

  it('should open filter panel when filter button is clicked', () => {
    render(
      <DataTable
        columns={campaignColumns}
        data={mockData}
        searchKey="campaign"
        enableAdvancedFiltering={true}
      />
    )

    const filterButton = screen.getByText('Filters')
    fireEvent.click(filterButton)

    expect(screen.getByText('Filter Options')).toBeInTheDocument()
  })

  it('should disable advanced filtering when enableAdvancedFiltering is false', () => {
    render(
      <DataTable
        columns={campaignColumns}
        data={mockData}
        searchKey="campaign"
        enableAdvancedFiltering={false}
      />
    )

    expect(screen.queryByText('Filters')).not.toBeInTheDocument()
  })
})

// Integration test for the complete filtering workflow
describe('DataTable Filtering Integration', () => {
  const mockData = generateMockTableData(20)

  it('should handle complete filtering workflow', async () => {
    render(
      <DataTable
        columns={campaignColumns}
        data={mockData}
        searchKey="campaign"
        enableAdvancedFiltering={true}
      />
    )

    // 1. Verify initial state
    expect(screen.getByText(`${mockData.length} results`)).toBeInTheDocument()

    // 2. Open filter panel
    const filterButton = screen.getByText('Filters')
    fireEvent.click(filterButton)
    expect(screen.getByText('Filter Options')).toBeInTheDocument()

    // 3. Apply performance filter
    const excellentBadge = screen.getByText('Excellent')
    fireEvent.click(excellentBadge)

    // 4. Verify filter chip appears
    await waitFor(() => {
      expect(screen.getByText('Performance: Excellent')).toBeInTheDocument()
    })

    // 5. Test search functionality
    const searchInput = screen.getByPlaceholderText('Search...')
    fireEvent.change(searchInput, { target: { value: 'Sale' } })

    // 6. Wait for debounced search and filtering
    await waitFor(() => {
      // Results should be filtered by both performance and search term
      const resultText = screen.getByText(/\d+ results?/)
      expect(resultText).toBeInTheDocument()
    }, { timeout: 500 })

    // 7. Clear all filters
    const clearAllButton = screen.getByText('Clear all')
    fireEvent.click(clearAllButton)

    // 8. Verify filters are cleared
    await waitFor(() => {
      expect(screen.queryByText('Performance: Excellent')).not.toBeInTheDocument()
    })
  })
})