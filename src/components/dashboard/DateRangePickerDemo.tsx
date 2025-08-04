"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Zap, 
  Filter,
  Download,
  RefreshCw,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Loader2
} from "lucide-react"
import { addDays, format } from "date-fns"
import { NumberTicker } from "@/components/ui/number-ticker"
import { TextAnimate } from "@/components/ui/text-animate"
import { HoverCardEffect } from "@/components/ui/hover-card-effect"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DateRangePickerDemo() {
  const [dateRange, setDateRange] = React.useState<{
    from: Date
    to: Date
  }>({
    from: addDays(new Date(), -30),
    to: new Date()
  })

  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [isExporting, setIsExporting] = React.useState(false)
  const [exportType, setExportType] = React.useState<'csv' | 'pdf' | null>(null)

  const presetRanges = [
    {
      label: "Last 7 days",
      range: { from: addDays(new Date(), -7), to: new Date() },
      icon: <Clock className="h-4 w-4" />,
      description: "Recent week"
    },
    {
      label: "Last 30 days", 
      range: { from: addDays(new Date(), -30), to: new Date() },
      icon: <Calendar className="h-4 w-4" />,
      description: "Past month"
    },
    {
      label: "Last 90 days",
      range: { from: addDays(new Date(), -90), to: new Date() },
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Quarterly view"
    },
    {
      label: "This year",
      range: { from: new Date(new Date().getFullYear(), 0, 1), to: new Date() },
      icon: <BarChart3 className="h-4 w-4" />,
      description: "Annual data"
    }
  ]

  // Handle refresh functionality
  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }, [])

  // Handle export functionality
  const handleExport = React.useCallback(async (type: 'csv' | 'pdf') => {
    setIsExporting(true)
    setExportType(type)
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const filename = `date-range-analytics-${format(dateRange.from, 'yyyy-MM-dd')}-to-${format(dateRange.to, 'yyyy-MM-dd')}`
      
      if (type === 'csv') {
        // Generate CSV data
        const csvData = Object.entries(mockMetrics).map(([key, metric]) => ({
          Metric: metric.label,
          Value: `${metric.prefix}${metric.value}${metric.suffix}`,
          Change: metric.change,
          Description: metric.description
        }))
        
        const csvContent = [
          'Metric,Value,Change,Description',
          ...csvData.map(row => `"${row.Metric}","${row.Value}","${row.Change}","${row.Description}"`)
        ].join('\n')
        
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${filename}.csv`
        link.click()
        URL.revokeObjectURL(url)
      } else if (type === 'pdf') {
        // For PDF, we'll create a simple text-based PDF
        const pdfContent = `Date Range Analytics Report
        
Period: ${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}
Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}

Metrics Summary:
${Object.entries(mockMetrics).map(([key, metric]) => 
  `${metric.label}: ${metric.prefix}${metric.value}${metric.suffix} (${metric.change})`
).join('\n')}
        `
        
        const blob = new Blob([pdfContent], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${filename}.txt`
        link.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
      setExportType(null)
    }
  }, [dateRange])

  // Generate dynamic metrics based on date range
  const mockMetrics = React.useMemo(() => {
    const daysDiff = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
    const baseRevenue = 1500
    const baseUsers = 400
    const baseConversions = 6.2
    const baseSessions = 800
    
    const revenueChange = (Math.random() * 20 + 5).toFixed(1)
    const usersChange = (Math.random() * 15 + 8).toFixed(1)
    const conversionsChange = (Math.random() * 5 + 1).toFixed(1)
    const sessionsChange = (Math.random() * 12 + 3).toFixed(1)
    
    return {
      revenue: {
        value: baseRevenue * daysDiff,
        prefix: "$",
        suffix: "",
        change: `+${revenueChange}%`,
        changeValue: Number(revenueChange),
        icon: <TrendingUp className="h-5 w-5" />,
        label: "Total Revenue",
        description: "Gross revenue for selected period",
        decimalPlaces: 0
      },
      users: {
        value: baseUsers * daysDiff,
        prefix: "",
        suffix: "",
        change: `+${usersChange}%`,
        changeValue: Number(usersChange),
        icon: <Activity className="h-5 w-5" />,
        label: "Active Users",
        description: "Unique users in timeframe",
        decimalPlaces: 0
      },
      conversions: {
        value: Number((baseConversions + (Math.random() * 4 - 2)).toFixed(1)),
        prefix: "",
        suffix: "%",
        change: `+${conversionsChange}%`,
        changeValue: Number(conversionsChange),
        icon: <Zap className="h-5 w-5" />,
        label: "Conversion Rate",
        description: "Percentage of converting visitors",
        decimalPlaces: 1
      },
      sessions: {
        value: baseSessions * daysDiff,
        prefix: "",
        suffix: "",
        change: `+${sessionsChange}%`,
        changeValue: Number(sessionsChange),
        icon: <BarChart3 className="h-5 w-5" />,
        label: "Total Sessions",
        description: "Number of user sessions",
        decimalPlaces: 0
      }
    }
  }, [dateRange, isRefreshing])

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <TextAnimate 
            animation="slideUp" 
            by="word" 
            className="text-3xl font-bold tracking-tight"
            as="h2"
          >
            Date Range Analytics
          </TextAnimate>
          <p className="text-muted-foreground">
            Analyze your data across custom time periods with advanced filtering capabilities
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 text-sm border-primary/20 hover:border-primary/30"
                disabled={isExporting}
              >
                {isExporting ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Exporting...
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={() => handleExport('csv')}
                disabled={isExporting}
                className="cursor-pointer"
              >
                <motion.div
                  className="flex items-center gap-2 w-full"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.1 }}
                >
                  <FileText className="h-4 w-4" />
                  <span>Export as CSV</span>
                  {exportType === 'csv' && isExporting && (
                    <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                  )}
                </motion.div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className="cursor-pointer"
              >
                <motion.div
                  className="flex items-center gap-2 w-full"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.1 }}
                >
                  <FileText className="h-4 w-4" />
                  <span>Export as PDF</span>
                  {exportType === 'pdf' && isExporting && (
                    <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                  )}
                </motion.div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-9 px-4 text-sm border-primary/20 hover:border-primary/30"
          >
            <div className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </div>
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Date Selection */}
        <div className="lg:col-span-1 space-y-6">
          {/* Date Range Picker Card */}
          <Card className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                Date Range Selection
              </CardTitle>
              <CardDescription>
                Choose your analysis timeframe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <DateRangePicker
                value={{ from: dateRange.from, to: dateRange.to }}
                onChange={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to })
                  }
                }}
                className="w-full"
              />
              
              <Separator />
              
              {/* Quick Presets */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Quick Presets</span>
                </div>
                <div className="space-y-2">
                  {presetRanges.map((preset, index) => (
                    <motion.div
                      key={preset.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ 
                        x: 4,
                        transition: { type: "spring", stiffness: 300, damping: 20 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDateRange(preset.range)}
                        className="w-full justify-start h-auto p-3 hover:bg-muted/50 group relative overflow-hidden"
                      >
                        {/* Subtle hover background effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="flex items-center gap-3 w-full relative z-10">
                          <motion.div 
                            className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            {preset.icon}
                          </motion.div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-sm group-hover:text-primary transition-colors duration-300">{preset.label}</div>
                            <div className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">{preset.description}</div>
                          </div>
                          <motion.div
                            whileHover={{ x: 2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                          </motion.div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Selection Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Current Selection</span>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">From:</span>{" "}
                    <span className="font-medium">{format(dateRange.from, "MMM dd, yyyy")}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">To:</span>{" "}
                    <span className="font-medium">{format(dateRange.to, "MMM dd, yyyy")}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Duration:</span>{" "}
                    <span className="font-medium">
                      {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Analytics Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(mockMetrics).map(([key, metric], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -4,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <HoverCardEffect
                  effectColor="#3b82f6"
                  effectOpacity={0.08}
                  effectSize={180}
                >
                  <Card className="group hover:shadow-xl transition-all duration-500 border-2 hover:border-primary/30 cursor-pointer relative overflow-hidden">
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <motion.div 
                              className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                              whileHover={{ rotate: 5, scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              {metric.icon}
                            </motion.div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                                {metric.label}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-3xl font-bold tracking-tight group-hover:text-primary transition-colors duration-300">
                              {metric.prefix}
                              <NumberTicker 
                                value={metric.value} 
                                decimalPlaces={metric.decimalPlaces}
                                className="font-bold"
                              />
                              {metric.suffix}
                            </div>
                            <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
                              {metric.description}
                            </p>
                          </div>
                        </div>
                        <motion.div 
                          className="flex items-center gap-1 text-sm"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          {metric.changeValue > 0 ? (
                            <ArrowUpRight className="h-4 w-4 text-green-600 group-hover:text-green-500 transition-colors duration-300" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-600 group-hover:text-red-500 transition-colors duration-300" />
                          )}
                          <span className={`font-medium transition-colors duration-300 ${
                            metric.changeValue > 0 
                              ? 'text-green-600 group-hover:text-green-500' 
                              : 'text-red-600 group-hover:text-red-500'
                          }`}>
                            {metric.change}
                          </span>
                        </motion.div>
                      </div>
                    </CardContent>
                    
                    {/* Animated border effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                  </Card>
                </HoverCardEffect>
              </motion.div>
            ))}
          </div>

          {/* Summary Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Analytics Summary
              </CardTitle>
              <CardDescription>
                Key insights for the selected time period
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Period</div>
                  <div className="text-lg font-semibold">
                    {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Total Days</div>
                  <div className="text-lg font-semibold">
                    {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} days
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Data Points</div>
                  <div className="text-lg font-semibold">
                    {Object.keys(mockMetrics).length} metrics
                  </div>
                </div>
              </div>
              
              <Separator />
              
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
                  Real-time Data
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  Live Updates
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}