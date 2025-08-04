"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { DataTable } from "./DataTable"
import { campaignColumns } from "./table-columns"
import { generateMockTableData } from "@/lib/data"
import { Filter } from "lucide-react"

export const UnifiedFilteringDemo = React.memo(function UnifiedFilteringDemo() {
  const tableData = React.useMemo(() => generateMockTableData(300), [])

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-foreground mb-3">
          Unified Data Filtering
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Professional-grade filtering capabilities with real-time search, advanced filters, and export functionality
        </p>
      </motion.div>

      {/* Data Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="space-y-6"
      >
        {/* Table Container with proper spacing */}
        <Card className="overflow-hidden shadow-sm p-6">
          <DataTable
            columns={campaignColumns}
            data={tableData}
            searchKey="campaign"
            searchPlaceholder="Search campaigns, keywords, metrics, or any data..."
            enableAdvancedFiltering={true}
            enableVirtualization={false}
            pageSizeOptions={[10, 25, 50, 100]}
            defaultPageSize={25}
            enableExport={true}
            exportFilename={`analytics-data-${new Date().toISOString().split('T')[0]}`}
          />
        </Card>
      </motion.div>
    </div>
  )
})