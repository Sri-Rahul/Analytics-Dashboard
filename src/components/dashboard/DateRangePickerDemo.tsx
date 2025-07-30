"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, TrendingUp, BarChart3 } from "lucide-react"
import { addDays, format } from "date-fns"

export function DateRangePickerDemo() {
  const [dateRange, setDateRange] = React.useState<{
    from: Date
    to: Date
  }>({
    from: addDays(new Date(), -30),
    to: new Date()
  })

  const presetRanges = [
    {
      label: "Last 7 days",
      range: { from: addDays(new Date(), -7), to: new Date() }
    },
    {
      label: "Last 30 days", 
      range: { from: addDays(new Date(), -30), to: new Date() }
    },
    {
      label: "Last 90 days",
      range: { from: addDays(new Date(), -90), to: new Date() }
    },
    {
      label: "This year",
      range: { from: new Date(new Date().getFullYear(), 0, 1), to: new Date() }
    }
  ]

  // Generate dynamic metrics based on date range
  const mockMetrics = React.useMemo(() => {
    const daysDiff = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
    const baseRevenue = 1500
    const baseUsers = 400
    const baseConversions = 6.2
    const baseSessions = 800
    
    return {
      revenue: `$${(baseRevenue * daysDiff).toLocaleString()}`,
      users: (baseUsers * daysDiff).toLocaleString(),
      conversions: `${(baseConversions + (Math.random() * 4 - 2)).toFixed(1)}%`,
      sessions: (baseSessions * daysDiff).toLocaleString()
    }
  }, [dateRange])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Date Range Analytics
          </CardTitle>
          <CardDescription>
            Interactive date range selection with real-time data filtering and preset options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Date Range Picker */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Select Date Range</span>
              </div>
              
              <DateRangePicker
                date={dateRange}
                onDateChange={setDateRange}
                className="w-full max-w-sm"
              />
            </div>

            {/* Preset Ranges */}
            <div className="space-y-3">
              <span className="text-sm font-medium">Quick Presets</span>
              <div className="flex flex-wrap gap-2">
                {presetRanges.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() => setDateRange(preset.range)}
                    className="text-xs"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Selected Range Display */}
            <motion.div
              key={`${dateRange.from.getTime()}-${dateRange.to.getTime()}`}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                        Analytics Overview
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full">
                    {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} days
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(mockMetrics).map(([key, value], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm border border-white/20 dark:border-gray-700/20"
                    >
                      <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {value}
                      </div>
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">
                        {key === 'conversions' ? 'Conversion Rate' : key}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Custom Ranges
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Quick Presets
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Real-time Updates
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}