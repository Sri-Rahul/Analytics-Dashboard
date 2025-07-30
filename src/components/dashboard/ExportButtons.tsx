"use client"

import * as React from "react"
import { CSVLink } from "react-csv"
import { Download, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableRow } from "@/lib/data"
import { useExport, CSV_HEADERS } from "@/hooks/useExport"

interface ExportButtonsProps {
  data: TableRow[]
  filename?: string
  className?: string
}

export function ExportButtons({ 
  data, 
  filename = "analytics-dashboard-data",
  className 
}: ExportButtonsProps) {
  const { state, exportCSV, exportPDF, resetState, formatDataForCSV } = useExport()
  const csvLinkRef = React.useRef<any>(null)

  // Format data for react-csv component
  const csvData = React.useMemo(() => formatDataForCSV(data), [data, formatDataForCSV])

  const handleCSVExport = async () => {
    await exportCSV(data, { filename })
  }

  const handlePDFExport = async () => {
    await exportPDF(data, { filename })
  }

  const currentTimestamp = new Date().toISOString().split('T')[0]
  const csvFilename = `${filename}-${currentTimestamp}.csv`

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            disabled={state.isExporting}
            className="relative"
          >
            {state.isExporting ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Exporting...
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </motion.div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={handleCSVExport}
            disabled={state.isExporting}
            className="cursor-pointer"
          >
            <motion.div
              className="flex items-center gap-2 w-full"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.1 }}
            >
              <FileText className="h-4 w-4" />
              <span>Export as CSV</span>
              {state.exportType === 'csv' && (
                <Loader2 className="h-4 w-4 animate-spin ml-auto" />
              )}
            </motion.div>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handlePDFExport}
            disabled={state.isExporting}
            className="cursor-pointer"
          >
            <motion.div
              className="flex items-center gap-2 w-full"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.1 }}
            >
              <FileText className="h-4 w-4" />
              <span>Export as PDF</span>
              {state.exportType === 'pdf' && (
                <Loader2 className="h-4 w-4 animate-spin ml-auto" />
              )}
            </motion.div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden CSV Link - Fallback for react-csv */}
      <CSVLink
        ref={csvLinkRef}
        data={csvData}
        headers={CSV_HEADERS}
        filename={csvFilename}
        className="hidden"
        target="_blank"
      />

      {/* Success/Error Notifications */}
      <ExportNotifications 
        success={state.success}
        error={state.error}
        exportType={state.exportType}
        onClose={resetState}
      />
    </div>
  )
}

// Notification component for export status
export function ExportNotifications({ 
  success, 
  error, 
  exportType,
  onClose 
}: { 
  success: boolean
  error: string | null
  exportType: 'csv' | 'pdf' | null
  onClose: () => void 
}) {
  React.useEffect(() => {
    if (success || error) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, error, onClose])

  return (
    <AnimatePresence>
      {success && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>
              CSV export completed successfully!
            </span>
          </div>
        </motion.div>
      )}
      
      {success && exportType === 'pdf' && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>
              PDF export completed successfully!
            </span>
          </div>
        </motion.div>
      )}
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>
              Export failed: {error}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}