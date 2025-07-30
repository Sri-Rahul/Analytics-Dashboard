import { renderHook, act } from '@testing-library/react'
import { useExport } from '../useExport'
import { generateMockTableData } from '@/lib/data'

describe('useExport', () => {
  const mockData = generateMockTableData(3)

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

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useExport())
    
    expect(result.current.state).toEqual({
      isExporting: false,
      exportType: null,
      error: null,
      success: false
    })
  })

  it('formats data correctly for CSV', () => {
    const { result } = renderHook(() => useExport())
    
    const formattedData = result.current.formatDataForCSV(mockData)
    
    expect(formattedData).toHaveLength(mockData.length)
    expect(formattedData[0]).toHaveProperty('Campaign')
    expect(formattedData[0]).toHaveProperty('Impressions')
    expect(formattedData[0]).toHaveProperty('ROI')
    expect(formattedData[0]).toHaveProperty('CTR')
    expect(formattedData[0]).toHaveProperty('Conversion Rate')
    
    // Check formatting
    expect(formattedData[0].Cost).toMatch(/^\$[\d,]+$/)
    expect(formattedData[0].Revenue).toMatch(/^\$[\d,]+$/)
    expect(formattedData[0].ROI).toMatch(/^\d+\.\d{2}%$/)
    expect(formattedData[0].CTR).toMatch(/^\d+\.\d{2}%$/)
  })

  it('generates correct filename', () => {
    const { result } = renderHook(() => useExport())
    
    const filename = result.current.generateFilename('test-data', 'csv', true)
    expect(filename).toMatch(/test-data-\d{4}-\d{2}-\d{2}\.csv/)
    
    const filenameNoTimestamp = result.current.generateFilename('test-data', 'csv', false)
    expect(filenameNoTimestamp).toBe('test-data.csv')
  })

  it('handles CSV export successfully', async () => {
    const { result } = renderHook(() => useExport())
    
    await act(async () => {
      await result.current.exportCSV(mockData, { filename: 'test-export' })
    })
    
    expect(result.current.state.success).toBe(true)
    expect(result.current.state.isExporting).toBe(false)
    expect(result.current.state.error).toBe(null)
  })

  it('resets state correctly', () => {
    const { result } = renderHook(() => useExport())
    
    // Set some state
    act(() => {
      result.current.state.success = true
      result.current.state.error = 'test error'
    })
    
    act(() => {
      result.current.resetState()
    })
    
    expect(result.current.state).toEqual({
      isExporting: false,
      exportType: null,
      error: null,
      success: false
    })
  })

  it('handles PDF export with not implemented error', async () => {
    const { result } = renderHook(() => useExport())
    
    await act(async () => {
      await result.current.exportPDF(mockData, { filename: 'test-export' })
    })
    
    expect(result.current.state.error).toBe('PDF export not yet implemented')
    expect(result.current.state.isExporting).toBe(false)
    expect(result.current.state.success).toBe(false)
  })
})