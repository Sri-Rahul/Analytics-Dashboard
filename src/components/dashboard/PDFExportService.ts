import { jsPDF } from 'jspdf'
import { TableRow } from '@/lib/data'

export interface PDFExportOptions {
  filename?: string
  includeCharts?: boolean
  includeSummary?: boolean
  includeTimestamp?: boolean
  title?: string
  subtitle?: string
}

export class PDFExportService {
  private doc: jsPDF
  private pageWidth: number
  private pageHeight: number
  private margin: number = 20
  private contentWidth: number
  private yPosition: number = 30

  constructor() {
    this.doc = new jsPDF()
    this.pageWidth = this.doc.internal.pageSize.getWidth()
    this.pageHeight = this.doc.internal.pageSize.getHeight()
    this.contentWidth = this.pageWidth - (this.margin * 2)
  }

  private addHeader(title: string, subtitle?: string) {
    // Main title
    this.doc.setFontSize(20)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(title, this.margin, this.yPosition)
    this.yPosition += 15

    // Subtitle with date
    if (subtitle) {
      this.doc.setFontSize(12)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(subtitle, this.margin, this.yPosition)
      this.yPosition += 10
    }

    // Generation timestamp
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    this.doc.text(`Generated on ${currentDate}`, this.margin, this.yPosition)
    this.yPosition += 20
  }

  private addSummarySection(data: TableRow[]) {
    // Section title
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Executive Summary', this.margin, this.yPosition)
    this.yPosition += 15

    // Calculate summary metrics
    const totalImpressions = data.reduce((sum, row) => sum + row.impressions, 0)
    const totalClicks = data.reduce((sum, row) => sum + row.clicks, 0)
    const totalConversions = data.reduce((sum, row) => sum + row.conversions, 0)
    const totalCost = data.reduce((sum, row) => sum + row.cost, 0)
    const totalRevenue = data.reduce((sum, row) => sum + row.revenue, 0)
    const overallROI = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0
    const overallCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
    const overallConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0

    // Summary metrics in a grid layout
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')

    const metrics = [
      { label: 'Total Campaigns', value: data.length.toString() },
      { label: 'Total Impressions', value: totalImpressions.toLocaleString() },
      { label: 'Total Clicks', value: totalClicks.toLocaleString() },
      { label: 'Total Conversions', value: totalConversions.toLocaleString() },
      { label: 'Total Cost', value: `$${totalCost.toLocaleString()}` },
      { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}` },
      { label: 'Overall ROI', value: `${overallROI.toFixed(2)}%` },
      { label: 'Overall CTR', value: `${overallCTR.toFixed(2)}%` },
      { label: 'Conversion Rate', value: `${overallConversionRate.toFixed(2)}%` }
    ]

    // Draw metrics in a 3-column layout
    const colWidth = this.contentWidth / 3
    let col = 0
    let row = 0

    metrics.forEach((metric, index) => {
      const x = this.margin + (col * colWidth)
      const y = this.yPosition + (row * 12)

      this.doc.setFont('helvetica', 'bold')
      this.doc.text(metric.label + ':', x, y)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(metric.value, x, y + 6)

      col++
      if (col >= 3) {
        col = 0
        row++
      }
    })

    this.yPosition += (Math.ceil(metrics.length / 3) * 12) + 20
  }

  private addPerformanceInsights(data: TableRow[]) {
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Performance Insights', this.margin, this.yPosition)
    this.yPosition += 15

    // Find top performing campaigns
    const sortedByROI = [...data].sort((a, b) => {
      const roiA = a.cost > 0 ? ((a.revenue - a.cost) / a.cost) * 100 : 0
      const roiB = b.cost > 0 ? ((b.revenue - b.cost) / b.cost) * 100 : 0
      return roiB - roiA
    })

    const topCampaigns = sortedByROI.slice(0, 3)
    const bottomCampaigns = sortedByROI.slice(-3).reverse()

    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Top Performing Campaigns:', this.margin, this.yPosition)
    this.yPosition += 10

    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')

    topCampaigns.forEach((campaign, index) => {
      const roi = campaign.cost > 0 ? ((campaign.revenue - campaign.cost) / campaign.cost) * 100 : 0
      this.doc.text(
        `${index + 1}. ${campaign.campaign} - ROI: ${roi.toFixed(2)}%`,
        this.margin + 10,
        this.yPosition
      )
      this.yPosition += 6
    })

    this.yPosition += 10
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Campaigns Needing Attention:', this.margin, this.yPosition)
    this.yPosition += 10

    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')

    bottomCampaigns.forEach((campaign, index) => {
      const roi = campaign.cost > 0 ? ((campaign.revenue - campaign.cost) / campaign.cost) * 100 : 0
      this.doc.text(
        `${index + 1}. ${campaign.campaign} - ROI: ${roi.toFixed(2)}%`,
        this.margin + 10,
        this.yPosition
      )
      this.yPosition += 6
    })

    this.yPosition += 20
  }

  private addDataTable(data: TableRow[]) {
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Detailed Campaign Data', this.margin, this.yPosition)
    this.yPosition += 15

    // Table headers
    const headers = ['Campaign', 'Impressions', 'Clicks', 'Conv.', 'Cost', 'Revenue', 'ROI']
    const colWidths = [45, 22, 18, 18, 22, 22, 18]
    
    // Draw header background
    this.doc.setFillColor(240, 240, 240)
    this.doc.rect(this.margin, this.yPosition - 5, this.contentWidth, 10, 'F')
    
    let xPosition = this.margin + 2
    this.doc.setFontSize(9)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(0, 0, 0)

    headers.forEach((header, index) => {
      this.doc.text(header, xPosition, this.yPosition)
      xPosition += colWidths[index]
    })

    this.yPosition += 12
    this.doc.setFont('helvetica', 'normal')

    // Draw data rows
    const maxRowsPerPage = Math.floor((this.pageHeight - this.yPosition - 30) / 8)
    let currentRow = 0

    data.forEach((row, index) => {
      if (currentRow >= maxRowsPerPage) {
        this.addNewPage()
        currentRow = 0
        
        // Redraw headers on new page
        this.doc.setFillColor(240, 240, 240)
        this.doc.rect(this.margin, this.yPosition - 5, this.contentWidth, 10, 'F')
        
        xPosition = this.margin + 2
        this.doc.setFont('helvetica', 'bold')
        headers.forEach((header, headerIndex) => {
          this.doc.text(header, xPosition, this.yPosition)
          xPosition += colWidths[headerIndex]
        })
        this.yPosition += 12
        this.doc.setFont('helvetica', 'normal')
      }

      // Alternate row background
      if (index % 2 === 1) {
        this.doc.setFillColor(250, 250, 250)
        this.doc.rect(this.margin, this.yPosition - 4, this.contentWidth, 8, 'F')
      }

      xPosition = this.margin + 2
      const roi = row.cost > 0 ? ((row.revenue - row.cost) / row.cost) * 100 : 0
      
      const rowData = [
        row.campaign.length > 18 ? row.campaign.substring(0, 15) + '...' : row.campaign,
        row.impressions.toLocaleString(),
        row.clicks.toLocaleString(),
        row.conversions.toString(),
        `$${row.cost.toLocaleString()}`,
        `$${row.revenue.toLocaleString()}`,
        `${roi.toFixed(1)}%`
      ]

      rowData.forEach((cell, cellIndex) => {
        this.doc.text(cell.toString(), xPosition, this.yPosition)
        xPosition += colWidths[cellIndex]
      })

      this.yPosition += 8
      currentRow++
    })
  }

  private addNewPage() {
    this.doc.addPage()
    this.yPosition = 30
  }

  private addFooter() {
    const totalPages = this.doc.internal.getNumberOfPages()
    
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i)
      this.doc.setFontSize(8)
      this.doc.setFont('helvetica', 'normal')
      this.doc.setTextColor(128, 128, 128)
      
      // Page number
      this.doc.text(
        `Page ${i} of ${totalPages}`,
        this.pageWidth - this.margin - 20,
        this.pageHeight - 10
      )
      
      // Footer text
      this.doc.text(
        'Generated by Analytics Dashboard',
        this.margin,
        this.pageHeight - 10
      )
    }
  }

  public async exportToPDF(data: TableRow[], options: PDFExportOptions = {}): Promise<void> {
    const {
      filename = 'analytics-report',
      includeCharts = false,
      includeSummary = true,
      includeTimestamp = true,
      title = 'Analytics Dashboard Report',
      subtitle = 'Campaign Performance Analysis'
    } = options

    try {
      // Add header
      this.addHeader(title, subtitle)

      // Add summary section
      if (includeSummary) {
        this.addSummarySection(data)
        this.addPerformanceInsights(data)
      }

      // Add data table
      this.addDataTable(data)

      // Add footer
      this.addFooter()

      // Generate filename
      const timestamp = includeTimestamp 
        ? `-${new Date().toISOString().split('T')[0]}`
        : ''
      const pdfFilename = `${filename}${timestamp}.pdf`

      // Save the PDF
      this.doc.save(pdfFilename)

    } catch (error) {
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}