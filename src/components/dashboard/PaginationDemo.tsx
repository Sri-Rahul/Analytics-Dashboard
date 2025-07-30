"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { DataTable } from "./DataTable"
import { campaignColumns } from "./table-columns"
import { generateMockTableData } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function PaginationDemo() {
  const [dataSize, setDataSize] = React.useState(50)
  const [enableVirtualization, setEnableVirtualization] = React.useState(false)
  
  // Generate data based on size
  const data = React.useMemo(() => {
    return generateMockTableData(dataSize)
  }, [dataSize])

  const dataSizeOptions = [
    { size: 20, label: "Small (20 rows)" },
    { size: 50, label: "Medium (50 rows)" },
    { size: 100, label: "Large (100 rows)" },
    { size: 500, label: "Very Large (500 rows)" },
    { size: 1000, label: "Huge (1000 rows)" },
    { size: 5000, label: "Massive (5000 rows)" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Management & Performance</CardTitle>
          <CardDescription>
            Efficient data handling with pagination and virtualization for optimal performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Dataset Size:</p>
              <div className="flex flex-wrap gap-2">
                {dataSizeOptions.map((option) => (
                  <Button
                    key={option.size}
                    variant={dataSize === option.size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDataSize(option.size)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Virtualization:</p>
              <div className="flex gap-2">
                <Button
                  variant={!enableVirtualization ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEnableVirtualization(false)}
                >
                  Pagination
                </Button>
                <Button
                  variant={enableVirtualization ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEnableVirtualization(true)}
                >
                  Virtual Scrolling
                </Button>
              </div>
            </div>
          </div>

          <motion.div
            key={`${dataSize}-${enableVirtualization}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DataTable
              columns={campaignColumns}
              data={data}
              searchKey="campaign"
              searchPlaceholder="Search campaigns..."
              enableAdvancedFiltering={true}
              enableVirtualization={enableVirtualization}
              virtualHeight={600}
              pageSizeOptions={[10, 20, 50, 100]}
              defaultPageSize={20}
            />
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}