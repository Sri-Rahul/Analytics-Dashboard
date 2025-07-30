"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "./DataTable"
import { campaignColumns } from "./table-columns"
import { generateMockTableData } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, Sliders, Target } from "lucide-react"

export function FilteringDemo() {
  const [data] = React.useState(() => generateMockTableData(75))
  const [filterMode, setFilterMode] = React.useState<'basic' | 'advanced'>('advanced')

  const filteringFeatures = [
    {
      name: "Real-time Search",
      description: "Instant search across all columns",
      icon: "🔍"
    },
    {
      name: "Column Filters",
      description: "Individual column filtering options",
      icon: "📊"
    },
    {
      name: "Range Filters",
      description: "Numeric and date range filtering",
      icon: "📈"
    },
    {
      name: "Multi-select",
      description: "Select multiple filter values",
      icon: "☑️"
    }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Data Filtering
          </CardTitle>
          <CardDescription>
            Powerful filtering system with real-time search, column filters, and advanced criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Filter Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={filterMode === 'basic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterMode('basic')}
                className="flex items-center gap-1"
              >
                <Search className="h-4 w-4" />
                Basic Search
              </Button>
              <Button
                variant={filterMode === 'advanced' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterMode('advanced')}
                className="flex items-center gap-1"
              >
                <Sliders className="h-4 w-4" />
                Advanced Filters
              </Button>
            </div>

            {/* Filtering Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteringFeatures.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <span className="text-lg">{feature.icon}</span>
                  <div>
                    <div className="font-medium">{feature.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {feature.description}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Filter Status */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {filterMode === 'advanced' ? 'Advanced' : 'Basic'} Mode
              </Badge>
              <Badge variant="outline">
                {data.length} Total Records
              </Badge>
              <Badge variant="outline">
                Real-time Updates
              </Badge>
            </div>

            {/* Data Table */}
            <motion.div
              key={filterMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DataTable
                columns={campaignColumns}
                data={data}
                searchKey="campaign"
                searchPlaceholder={
                  filterMode === 'advanced' 
                    ? "Search campaigns, keywords, or any field..." 
                    : "Basic search..."
                }
                enableAdvancedFiltering={filterMode === 'advanced'}
                pageSizeOptions={[10, 25, 50, 100]}
                defaultPageSize={25}
              />
            </motion.div>

            {/* Filter Tips */}
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-amber-800 dark:text-amber-200">
                  Filtering Tips
                </span>
              </div>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                <li>• Use the search box for quick text-based filtering</li>
                <li>• Click column headers to access individual column filters</li>
                <li>• Combine multiple filters for precise data selection</li>
                <li>• All filters work in real-time as you type</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}