"use client"

import { useState, useCallback } from "react"
import { TableRow } from "@/lib/data"

export interface ExportOptions {
  filename?: string
  includeTimestamp?: boolean
  format?: 'csv' | 'pdf'
}

export interface ExportState {
  isExporting: boolean
  exportType: 'csv' | 'pdf' | null
  error: string | null
  success: boolean
}

export function useExport() {
  const [state, setState] = useState<ExportState>({
    isExporting: false,
    exportType: null,
    error: null,
    success: false
  })

  const resetState = useCallback(() => {
    setState({
      isExporting: false,
      exportType: null,
      error: null,
      success: false
    })
  }, [])

  const formatDataForCSV = useCallback((data: TableRow[]) => {
    return data.map((row) => {
      const roi = row.cost > 0 ? ((row.revenue - row.cost) / row.cost) * 100 : 0
      const ctr = row.impressions > 0 ? (row.clicks / row.impressions) * 100 : 0
      const conversionRate = row.clicks > 0 ? (row.conversions / row.clicks) * 100 : 0

      return {
        Campaign: row.campaign,
        Impressions: row.impressions,
        Clicks: row.clicks,
        Conversions: row.conversions,
        Cost: `$${row.cost.toLocaleString()}`,
        Revenue: `$${row.revenue.toLocaleString()}`,
        ROI: `${roi.toFixed(2)}%`,
        CTR: `${ctr.toFixed(2)}%`,
        "Conversion Rate": `${conversionRate.toFixed(2)}%`,
        Date: new Date(row.date).toLocaleDateString()
      }
    })
  }, [])

  const generateFilename = useCallback((
    baseName: string, 
    format: 'csv' | 'pdf', 
    includeTimestamp: boolean = true
  ) => {
    const timestamp = includeTimestamp 
      ? `-${new Date().toISOString().split('T')[0]}`
      : ''
    return `${baseName}${timestamp}.${format}`
  }, [])

  const exportCSV = useCallback(async (
    data: TableRow[], 
    options: ExportOptions = {}
  ) => {
    const { filename = 'analytics-data', includeTimestamp = true } = options

    setState(prev => ({
      ...prev,
      isExporting: true,
      exportType: 'csv',
      error: null
    }))

    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 300))

      const formattedData = formatDataForCSV(data)
      const csvFilename = generateFilename(filename, 'csv', includeTimestamp)

      // Create CSV content
      const headers = [
        'Campaign', 'Impressions', 'Clicks', 'Conversions', 
        'Cost', 'Revenue', 'ROI', 'CTR', 'Conversion Rate', 'Date'
      ]
      
      const csvContent = [
        headers.join(','),
        ...formattedData.map(row => 
          headers.map(header => {
            const value = (row as any)[header]
            // Escape values that contain commas or quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value
          }).join(',')
        )
      ].join('\n')

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', csvFilename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setState(prev => ({
        ...prev,
        isExporting: false,
        exportType: null,
        success: true
      }))

      // Reset success state after 3 seconds
      setTimeout(() => {
        setState(prev => ({ ...prev, success: false }))
      }, 3000)

    } catch (error) {
      setState(prev => ({
        ...prev,
        isExporting: false,
        exportType: null,
        error: error instanceof Error ? error.message : 'CSV export failed'
      }))
    }
  }, [formatDataForCSV, generateFilename])

  const exportPDF = useCallback(async (
    data: TableRow[], 
    options: ExportOptions = {}
  ) => {
    const { filename = 'analytics-data', includeTimestamp = true } = options

    setState(prev => ({
      ...prev,
      isExporting: true,
      exportType: 'pdf',
      error: null
    }))

    try {
      // Dynamic import to reduce bundle size
      const { PDFExportService } = await import('../components/dashboard/PDFExportService')
      
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 800))

      const pdfService = new PDFExportService()
      await pdfService.exportToPDF(data, {
        filename,
        includeTimestamp,
        includeSummary: true,
        includeCharts: false, // Charts will be implemented later if needed
        title: 'Analytics Dashboard Report',
        subtitle: 'Campaign Performance Analysis'
      })

      setState(prev => ({
        ...prev,
        isExporting: false,
        exportType: null,
        success: true
      }))

      // Reset success state after 3 seconds
      setTimeout(() => {
        setState(prev => ({ ...prev, success: false }))
      }, 3000)

    } catch (error) {
      setState(prev => ({
        ...prev,
        isExporting: false,
        exportType: null,
        error: error instanceof Error ? error.message : 'PDF export failed'
      }))
    }
  }, [generateFilename])

  return {
    state,
    exportCSV,
    exportPDF,
    resetState,
    formatDataForCSV,
    generateFilename
  }
}

// CSV headers configuration
export const CSV_HEADERS = [
  { label: "Campaign", key: "Campaign" },
  { label: "Impressions", key: "Impressions" },
  { label: "Clicks", key: "Clicks" },
  { label: "Conversions", key: "Conversions" },
  { label: "Cost", key: "Cost" },
  { label: "Revenue", key: "Revenue" },
  { label: "ROI", key: "ROI" },
  { label: "CTR", key: "CTR" },
  { label: "Conversion Rate", key: "Conversion Rate" },
  { label: "Date", key: "Date" }
]