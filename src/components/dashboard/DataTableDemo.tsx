"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "./DataTable"
import { campaignColumns } from "./table-columns"
import { generateMockTableData } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, Search, Filter, Download } from "lucide-react"

export function DataTableDemo() {
  const [data] = React.useState(() => generateMockTableData(50))
  const [enableAdvancedFiltering, setEnableAdvancedFiltering] = React.useState(true)

  const features = [
    { name: "Sorting", icon: "↕️", description: "Multi-column sorting" },
    { name: "Filtering", icon: "🔍", description: "Advanced filtering options" },
    { name: "Search", icon: "🔎", description: "Real-time search" },
    { name: "Pagination", icon: "📄", description: "Efficient data pagination" },
    { name: "Export", icon: "📊", description: "CSV & PDF export" }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table className="h-5 w-5" />
            Interactive Data Table
          </CardTitle>
          <CardDescription>
            Feature-rich data table with sorting, filtering, search, and export capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            {features.map((feature) => (
              <Badge key={feature.name} variant="secondary" className="flex items-center gap-1">
                <span>{feature.icon}</span>
                {feature.name}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            <Button
              variant={enableAdvancedFiltering ? "default" : "outline"}
              size="sm"
              onClick={() => setEnableAdvancedFiltering(true)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Advanced Filtering
            </Button>
            <Button
              variant={!enableAdvancedFiltering ? "default" : "outline"}
              size="sm"
              onClick={() => setEnableAdvancedFiltering(false)}
            >
              <Search className="h-4 w-4 mr-1" />
              Simple Search
            </Button>
          </div>

          <motion.div
            key={enableAdvancedFiltering ? "advanced" : "simple"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DataTable
              columns={campaignColumns}
              data={data}
              searchKey="campaign"
              searchPlaceholder="Search campaigns..."
              enableAdvancedFiltering={enableAdvancedFiltering}
              pageSizeOptions={[10, 20, 50]}
              defaultPageSize={20}
            />
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}