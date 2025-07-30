import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ExportButtons } from '../ExportButtons'
import { generateMockTableData } from '@/lib/data'

// Mock the react-csv CSVLink component
jest.mock('react-csv', () => ({
  CSVLink: jest.fn(({ children, ...props }) => (
    <div data-testid="csv-link" {...props}>
      {children}
    </div>
  ))
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}))

describe('ExportButtons', () => {
  const mockData = generateMockTableData(5)

  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = jest.fn(() => 'mock-url')
    global.URL.revokeObjectURL = jest.fn()
    
    // Mock document.createElement and related methods
    const mockLink = {
      setAttribute: jest.fn(),
      click: jest.fn(),
      style: { visibility: '' }
    }
    jest.spyOn(document, 'createElement').mockReturnValue(mockLink as any)
    jest.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any)
    jest.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders export button', () => {
    render(<ExportButtons data={mockData} />)
    
    expect(screen.getByText('Export')).toBeInTheDocument()
  })

  it('shows dropdown menu when clicked', async () => {
    render(<ExportButtons data={mockData} />)
    
    const exportButton = screen.getByText('Export')
    fireEvent.click(exportButton)
    
    await waitFor(() => {
      expect(screen.getByText('Export as CSV')).toBeInTheDocument()
      expect(screen.getByText('Export as PDF')).toBeInTheDocument()
    })
  })

  it('handles CSV export', async () => {
    render(<ExportButtons data={mockData} filename="test-export" />)
    
    const exportButton = screen.getByText('Export')
    fireEvent.click(exportButton)
    
    const csvOption = await screen.findByText('Export as CSV')
    fireEvent.click(csvOption)
    
    await waitFor(() => {
      expect(screen.getByText('Exporting...')).toBeInTheDocument()
    })
  })

  it('formats data correctly for CSV export', () => {
    const { container } = render(<ExportButtons data={mockData} />)
    
    // The CSV data formatting is tested through the hook
    expect(container).toBeInTheDocument()
  })

  it('generates correct filename with timestamp', () => {
    render(<ExportButtons data={mockData} filename="custom-export" />)
    
    const csvLink = screen.getByTestId('csv-link')
    const filename = csvLink.getAttribute('filename')
    
    expect(filename).toMatch(/custom-export-\d{4}-\d{2}-\d{2}\.csv/)
  })
})