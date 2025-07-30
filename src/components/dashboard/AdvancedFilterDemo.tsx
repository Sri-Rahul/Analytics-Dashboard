"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "./DataTable"
import { campaignColumns } from "./table-columns"
import { generateMockTableData } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, Calendar, TrendingUp } from "lucide-react"

export function AdvancedFilterDemo() {
  const [data] = React.useState(() => generateMockTableData(100))
  const [showFilters, setShowFilters] = React.useState(true)

  return (
    <div className="space-y-6 w-full max-w-full">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Filter className="h-5 w-5 shrink-0" />
            <span className="truncate">Advanced Filtering System</span>
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Comprehensive filtering capabilities with real-time search, date ranges, and multi-criteria filtering
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
              <Search className="h-3 w-3 shrink-0" />
              <span className="hidden sm:inline">Real-time Search</span>
              <span className="sm:hidden">Search</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
              <Calendar className="h-3 w-3 shrink-0" />
              <span className="hidden sm:inline">Date Range Filtering</span>
              <span className="sm:hidden">Date Range</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
              <TrendingUp className="h-3 w-3 shrink-0" />
              <span className="hidden sm:inline">Performance Filters</span>
              <span className="sm:hidden">Performance</span>
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <span className="hidden sm:inline">Multi-column Sorting</span>
              <span className="sm:hidden">Sorting</span>
            </Badge>
          </div>

          <div className="mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="mb-4 w-full sm:w-auto"
              size="sm"
            >
              {showFilters ? "Hide" : "Show"} Advanced Filters
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full overflow-hidden"
          >
            <div className="rounded-lg border bg-card">
              <DataTable
                columns={campaignColumns}
                data={data}
                searchKey="campaign"
                searchPlaceholder="Search campaigns, keywords, or performance metrics..."
                enableAdvancedFiltering={showFilters}
                pageSizeOptions={[10, 25, 50, 100]}
                defaultPageSize={25}
              />
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}