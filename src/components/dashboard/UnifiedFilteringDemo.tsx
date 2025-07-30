"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "./DataTable"
import { campaignColumns } from "./table-columns"
import { generateMockTableData } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Search, Sliders, Target, Database, BarChart3 } from "lucide-react"

export function UnifiedFilteringDemo() {
  const [smallData] = React.useState(() => generateMockTableData(75))
  const [mediumData] = React.useState(() => generateMockTableData(200))
  const [largeData] = React.useState(() => generateMockTableData(750))
  
  const [activeTab, setActiveTab] = React.useState("basic")

  const filteringModes = [
    {
      id: "basic",
      name: "Basic Search",
      icon: Search,
      description: "Simple text-based search across all columns",
      data: smallData,
      enableAdvanced: false,
      pageSize: 10
    },
    {
      id: "advanced",
      name: "Advanced Filters",
      icon: Sliders,
      description: "Multi-criteria filtering with column-specific options",
      data: mediumData,
      enableAdvanced: true,
      pageSize: 25
    },
    {
      id: "performance",
      name: "Performance Mode",
      icon: BarChart3,
      description: "Optimized for large datasets with virtualization",
      data: largeData,
      enableAdvanced: true,
      pageSize: 50,
      enableVirtualization: true
    }
  ]

  const currentMode = filteringModes.find(mode => mode.id === activeTab) || filteringModes[0]

  const filteringFeatures = [
    {
      name: "Real-time Search",
      description: "Instant search across all columns with live results",
      icon: "🔍",
      available: ["basic", "advanced", "performance"]
    },
    {
      name: "Advanced Column Filters",
      description: "Individual column filtering with dropdowns and multi-select",
      icon: "📊",
      available: ["advanced", "performance"]
    },
    {
      name: "Range Filters",
      description: "Numeric ranges for cost, revenue, impressions, and date filtering",
      icon: "📈",
      available: ["advanced", "performance"]
    },
    {
      name: "Virtual Scrolling",
      description: "Optimized rendering for large datasets (500+ records)",
      icon: "⚡",
      available: ["performance"]
    },
    {
      name: "Multi-select Options",
      description: "Select multiple filter values with batch operations",
      icon: "☑️",
      available: ["advanced", "performance"]
    },
    {
      name: "Export Filtered Data",
      description: "Export current filtered results to CSV/PDF formats",
      icon: "📤",
      available: ["basic", "advanced", "performance"]
    },
    {
      name: "Performance Analytics",
      description: "ROI filtering and performance categorization",
      icon: "📊",
      available: ["advanced", "performance"]
    },
    {
      name: "Date Range Filtering",
      description: "Custom date range selection with presets",
      icon: "📅",
      available: ["advanced", "performance"]
    }
  ]

  return (
    <div className="space-y-6 w-full max-w-full">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Filter className="h-5 w-5 shrink-0" />
            <span className="truncate">Unified Data Filtering System</span>
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Comprehensive filtering capabilities from basic search to advanced multi-criteria filtering with performance optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-6 w-full">
            {/* Filter Mode Tabs - Enhanced Mobile Responsive */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-1 h-auto p-1 bg-muted/50">
                {filteringModes.map((mode) => (
                  <TabsTrigger 
                    key={mode.id} 
                    value={mode.id} 
                    className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all hover:bg-muted/80"
                  >
                    <mode.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate font-medium">{mode.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {filteringModes.map((mode) => (
                <TabsContent key={mode.id} value={mode.id} className="mobile-sequential-layout space-y-6 w-full">
                  {/* Step 1: Mode Description - Always First */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200/30 dark:border-blue-800/30"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <mode.icon className="h-5 w-5 text-blue-600 shrink-0" />
                        <span className="font-bold text-blue-800 dark:text-blue-200 text-lg">
                          {mode.name}
                        </span>
                        <Badge variant="outline" className="ml-auto sm:ml-0 text-sm px-3 py-1 font-medium">
                          {mode.data.length} records
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                      {mode.description}
                    </p>
                  </motion.div>

                  {/* Step 2: Available Features - Second */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="w-full"
                  >
                    <h3 className="text-lg font-semibold mb-4 text-foreground">Available Features</h3>
                    {/* Mobile: Single column stack, Desktop: Multi-column grid */}
                    <div className="flex flex-col gap-4 sm:grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 sm:gap-4 w-full">
                      {filteringFeatures.map((feature, index) => (
                        <motion.div
                          key={feature.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: 0.3 + (index * 0.05) }}
                          className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all hover:shadow-md min-h-[100px] w-full ${
                            feature.available.includes(mode.id)
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 hover:scale-[1.02]'
                              : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <span className="text-2xl shrink-0 mt-1">{feature.icon}</span>
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="text-base font-semibold text-foreground">
                              {feature.name}
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed">
                              {feature.description}
                            </div>
                            {!feature.available.includes(mode.id) && (
                              <div className="text-xs text-gray-500 italic bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-medium">
                                Not available in this mode
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Step 3: Data Table - Completely Separate Section */}
                  <motion.div
                    key={`table-${mode.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="w-full mt-8" // Extra margin for clear separation
                  >
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2 text-foreground">Data Table</h3>
                      <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent w-full"></div>
                    </div>
                    
                    {/* Mobile Table Instructions - Enhanced Visibility */}
                    <div className="lg:hidden mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-800 shadow-sm">
                      <div className="flex items-center gap-3 text-amber-800 dark:text-amber-200">
                        <span className="text-2xl animate-bounce">📱</span>
                        <div>
                          <div className="font-semibold text-base">Mobile Tip</div>
                          <div className="text-sm">Swipe left to scroll through all table columns →</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Dedicated full-width table container - isolated from other content */}
                    <div className="w-full clear-both">
                      <div className="w-full overflow-hidden rounded-lg border bg-card shadow-sm">
                        <DataTable
                          columns={campaignColumns}
                          data={mode.data}
                          searchKey="campaign"
                          searchPlaceholder={
                            mode.id === "basic" 
                              ? "Basic search across all fields..." 
                              : mode.id === "advanced"
                              ? "Advanced search with multi-criteria filters..."
                              : "Search large dataset with performance optimization..."
                          }
                          enableAdvancedFiltering={mode.enableAdvanced}
                          enableVirtualization={mode.enableVirtualization}
                          virtualHeight={mode.enableVirtualization ? 600 : undefined}
                          pageSizeOptions={[10, 25, 50, 100]}
                          defaultPageSize={mode.pageSize}
                          enableExport={true}
                          exportFilename={`analytics-data-${mode.id}-mode`}
                        />
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Current Mode Status - Responsive Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <Target className="h-3 w-3 shrink-0" />
                <span className="truncate">{currentMode.name}</span>
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Database className="h-3 w-3 mr-1 shrink-0" />
                {currentMode.data.length} Records
              </Badge>
              {currentMode.enableAdvanced && (
                <Badge variant="outline" className="text-xs">
                  Advanced Filtering
                </Badge>
              )}
              {currentMode.enableVirtualization && (
                <Badge variant="outline" className="text-xs">
                  ⚡ Virtualized
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}