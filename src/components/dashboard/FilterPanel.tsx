"use client"

import * as React from "react"
import { Filter, RotateCcw, Search, TrendingUp, TrendingDown, Minus, SortAsc, SortDesc } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { FilterChip, FilterChipsContainer } from "@/components/ui/filter-chip"
import { DateRangePicker, DateRange } from "@/components/ui/date-range-picker"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export interface FilterState {
  performance: string[]
  costRange: [number, number]
  revenueRange: [number, number]
  impressionsRange: [number, number]
  clicksRange: [number, number]
  conversionRange: [number, number]
  dateRange: DateRange
  category: string[]
  status: string[]
  campaignType: string[]
  device: string[]
  location: string[]
  searchTerm: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  showOnlyProfitable: boolean
  showOnlyActive: boolean
}

interface FilterPanelProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  isOpen: boolean
  onToggle: () => void
  className?: string
}

const performanceOptions = [
  { value: "excellent", label: "Excellent", color: "default", icon: TrendingUp },
  { value: "good", label: "Good", color: "secondary", icon: TrendingUp },
  { value: "fair", label: "Fair", color: "outline", icon: Minus },
  { value: "poor", label: "Poor", color: "destructive", icon: TrendingDown }
] as const

const categoryOptions = [
  { value: "social", label: "Social Media" },
  { value: "search", label: "Search Engine" },
  { value: "email", label: "Email Marketing" },
  { value: "display", label: "Display Ads" },
  { value: "video", label: "Video Ads" },
  { value: "affiliate", label: "Affiliate Marketing" },
  { value: "influencer", label: "Influencer Marketing" }
] as const

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" }
] as const

const campaignTypeOptions = [
  { value: "awareness", label: "Brand Awareness" },
  { value: "conversion", label: "Conversion" },
  { value: "traffic", label: "Traffic" },
  { value: "engagement", label: "Engagement" },
  { value: "lead_generation", label: "Lead Generation" },
  { value: "app_promotion", label: "App Promotion" }
] as const

const deviceOptions = [
  { value: "desktop", label: "Desktop" },
  { value: "mobile", label: "Mobile" },
  { value: "tablet", label: "Tablet" }
] as const

const locationOptions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "other", label: "Other" }
] as const

const sortOptions = [
  { value: "campaign", label: "Campaign Name" },
  { value: "date", label: "Date" },
  { value: "impressions", label: "Impressions" },
  { value: "clicks", label: "Clicks" },
  { value: "conversions", label: "Conversions" },
  { value: "cost", label: "Cost" },
  { value: "revenue", label: "Revenue" },
  { value: "roi", label: "ROI" }
] as const

export function FilterPanel({
  filters,
  onFiltersChange,
  isOpen,
  onToggle,
  className
}: FilterPanelProps) {
  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      performance: [],
      costRange: [0, 10000],
      revenueRange: [0, 50000],
      impressionsRange: [0, 500000],
      clicksRange: [0, 25000],
      conversionRange: [0, 5000],
      dateRange: { from: undefined, to: undefined },
      category: [],
      status: [],
      campaignType: [],
      device: [],
      location: [],
      searchTerm: "",
      sortBy: "date",
      sortOrder: "desc",
      showOnlyProfitable: false,
      showOnlyActive: false
    })
  }

  // Toggle functions for multi-select filters
  const toggleArrayFilter = (filterKey: keyof FilterState, value: string) => {
    const currentArray = (filters[filterKey] as string[]) || []
    const isSelected = currentArray.includes(value)
    updateFilters({
      [filterKey]: isSelected
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
    })
  }

  // Remove functions for filter chips
  const removeArrayFilter = (filterKey: keyof FilterState, value: string) => {
    const currentArray = (filters[filterKey] as string[]) || []
    updateFilters({
      [filterKey]: currentArray.filter(item => item !== value)
    })
  }

  const hasActiveFilters = 
    (filters.performance?.length || 0) > 0 ||
    (filters.category?.length || 0) > 0 ||
    (filters.status?.length || 0) > 0 ||
    (filters.campaignType?.length || 0) > 0 ||
    (filters.device?.length || 0) > 0 ||
    (filters.location?.length || 0) > 0 ||
    (filters.costRange?.[0] || 0) > 0 || (filters.costRange?.[1] || 10000) < 10000 ||
    (filters.revenueRange?.[0] || 0) > 0 || (filters.revenueRange?.[1] || 50000) < 50000 ||
    (filters.impressionsRange?.[0] || 0) > 0 || (filters.impressionsRange?.[1] || 500000) < 500000 ||
    (filters.clicksRange?.[0] || 0) > 0 || (filters.clicksRange?.[1] || 25000) < 25000 ||
    (filters.conversionRange?.[0] || 0) > 0 || (filters.conversionRange?.[1] || 5000) < 5000 ||
    filters.dateRange?.from || filters.dateRange?.to ||
    (filters.searchTerm?.length || 0) > 0 ||
    filters.showOnlyProfitable ||
    filters.showOnlyActive ||
    filters.sortBy !== "date" ||
    filters.sortOrder !== "desc"

  const activeFilterCount = 
    (filters.performance?.length || 0) + 
    (filters.category?.length || 0) +
    (filters.status?.length || 0) +
    (filters.campaignType?.length || 0) +
    (filters.device?.length || 0) +
    (filters.location?.length || 0) +
    ((filters.costRange?.[0] || 0) > 0 || (filters.costRange?.[1] || 10000) < 10000 ? 1 : 0) +
    ((filters.revenueRange?.[0] || 0) > 0 || (filters.revenueRange?.[1] || 50000) < 50000 ? 1 : 0) +
    ((filters.impressionsRange?.[0] || 0) > 0 || (filters.impressionsRange?.[1] || 500000) < 500000 ? 1 : 0) +
    ((filters.clicksRange?.[0] || 0) > 0 || (filters.clicksRange?.[1] || 25000) < 25000 ? 1 : 0) +
    ((filters.conversionRange?.[0] || 0) > 0 || (filters.conversionRange?.[1] || 5000) < 5000 ? 1 : 0) +
    (filters.dateRange?.from || filters.dateRange?.to ? 1 : 0) +
    ((filters.searchTerm?.length || 0) > 0 ? 1 : 0) +
    (filters.showOnlyProfitable ? 1 : 0) +
    (filters.showOnlyActive ? 1 : 0) +
    (filters.sortBy !== "date" || filters.sortOrder !== "desc" ? 1 : 0)

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onToggle}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filter Chips */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FilterChipsContainer>
              {/* Performance Filters */}
              {(filters.performance || []).map((perf) => {
                const option = performanceOptions.find(opt => opt.value === perf)
                return (
                  <FilterChip
                    key={perf}
                    label="Performance"
                    value={option?.label || perf}
                    onRemove={() => removeArrayFilter('performance', perf)}
                  />
                )
              })}

              {/* Category Filters */}
              {(filters.category || []).map((cat) => {
                const option = categoryOptions.find(opt => opt.value === cat)
                return (
                  <FilterChip
                    key={cat}
                    label="Category"
                    value={option?.label || cat}
                    onRemove={() => removeArrayFilter('category', cat)}
                  />
                )
              })}

              {/* Status Filters */}
              {(filters.status || []).map((stat) => {
                const option = statusOptions.find(opt => opt.value === stat)
                return (
                  <FilterChip
                    key={stat}
                    label="Status"
                    value={option?.label || stat}
                    onRemove={() => removeArrayFilter('status', stat)}
                  />
                )
              })}

              {/* Campaign Type Filters */}
              {(filters.campaignType || []).map((type) => {
                const option = campaignTypeOptions.find(opt => opt.value === type)
                return (
                  <FilterChip
                    key={type}
                    label="Campaign Type"
                    value={option?.label || type}
                    onRemove={() => removeArrayFilter('campaignType', type)}
                  />
                )
              })}

              {/* Device Filters */}
              {(filters.device || []).map((device) => {
                const option = deviceOptions.find(opt => opt.value === device)
                return (
                  <FilterChip
                    key={device}
                    label="Device"
                    value={option?.label || device}
                    onRemove={() => removeArrayFilter('device', device)}
                  />
                )
              })}

              {/* Location Filters */}
              {(filters.location || []).map((loc) => {
                const option = locationOptions.find(opt => opt.value === loc)
                return (
                  <FilterChip
                    key={loc}
                    label="Location"
                    value={option?.label || loc}
                    onRemove={() => removeArrayFilter('location', loc)}
                  />
                )
              })}
              
              {/* Range Filters */}
              {((filters.costRange?.[0] || 0) > 0 || (filters.costRange?.[1] || 10000) < 10000) && (
                <FilterChip
                  label="Cost"
                  value={`$${filters.costRange?.[0] || 0} - $${filters.costRange?.[1] || 10000}`}
                  onRemove={() => updateFilters({ costRange: [0, 10000] })}
                />
              )}
              
              {((filters.revenueRange?.[0] || 0) > 0 || (filters.revenueRange?.[1] || 50000) < 50000) && (
                <FilterChip
                  label="Revenue"
                  value={`$${filters.revenueRange?.[0] || 0} - $${filters.revenueRange?.[1] || 50000}`}
                  onRemove={() => updateFilters({ revenueRange: [0, 50000] })}
                />
              )}

              {((filters.impressionsRange?.[0] || 0) > 0 || (filters.impressionsRange?.[1] || 500000) < 500000) && (
                <FilterChip
                  label="Impressions"
                  value={`${(filters.impressionsRange?.[0] || 0).toLocaleString()} - ${(filters.impressionsRange?.[1] || 500000).toLocaleString()}`}
                  onRemove={() => updateFilters({ impressionsRange: [0, 500000] })}
                />
              )}

              {((filters.clicksRange?.[0] || 0) > 0 || (filters.clicksRange?.[1] || 25000) < 25000) && (
                <FilterChip
                  label="Clicks"
                  value={`${(filters.clicksRange?.[0] || 0).toLocaleString()} - ${(filters.clicksRange?.[1] || 25000).toLocaleString()}`}
                  onRemove={() => updateFilters({ clicksRange: [0, 25000] })}
                />
              )}

              {((filters.conversionRange?.[0] || 0) > 0 || (filters.conversionRange?.[1] || 5000) < 5000) && (
                <FilterChip
                  label="Conversions"
                  value={`${filters.conversionRange?.[0] || 0} - ${filters.conversionRange?.[1] || 5000}`}
                  onRemove={() => updateFilters({ conversionRange: [0, 5000] })}
                />
              )}
              
              {/* Date Range Filter */}
              {(filters.dateRange.from || filters.dateRange.to) && (
                <FilterChip
                  label="Date Range"
                  value={`${filters.dateRange.from?.toLocaleDateString() || 'Start'} - ${filters.dateRange.to?.toLocaleDateString() || 'End'}`}
                  onRemove={() => updateFilters({ dateRange: { from: undefined, to: undefined } })}
                />
              )}

              {/* Search Filter */}
              {filters.searchTerm && (
                <FilterChip
                  label="Search"
                  value={filters.searchTerm}
                  onRemove={() => updateFilters({ searchTerm: "" })}
                />
              )}

              {/* Boolean Filters */}
              {filters.showOnlyProfitable && (
                <FilterChip
                  label="Filter"
                  value="Profitable Only"
                  onRemove={() => updateFilters({ showOnlyProfitable: false })}
                />
              )}

              {filters.showOnlyActive && (
                <FilterChip
                  label="Filter"
                  value="Active Only"
                  onRemove={() => updateFilters({ showOnlyActive: false })}
                />
              )}

              {/* Sort Filter */}
              {((filters.sortBy || "date") !== "date" || (filters.sortOrder || "desc") !== "desc") && (
                <FilterChip
                  label="Sort"
                  value={`${sortOptions.find(opt => opt.value === (filters.sortBy || "date"))?.label || filters.sortBy} ${(filters.sortOrder || "desc") === 'asc' ? '↑' : '↓'}`}
                  onRemove={() => updateFilters({ sortBy: "date", sortOrder: "desc" })}
                />
              )}
            </FilterChipsContainer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Advanced Filter Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Search Campaigns</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by campaign name..."
                      value={filters.searchTerm || ""}
                      onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Separator />

                {/* Performance Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Performance Level</Label>
                  <div className="flex flex-wrap gap-2">
                    {performanceOptions.map((option) => {
                      const isSelected = (filters.performance || []).includes(option.value)
                      const Icon = option.icon
                      return (
                        <motion.div
                          key={option.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Badge
                            variant={isSelected ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer transition-all duration-200 gap-1",
                              isSelected && "ring-2 ring-primary/20"
                            )}
                            onClick={() => toggleArrayFilter('performance', option.value)}
                          >
                            <Icon className="h-3 w-3" />
                            {option.label}
                          </Badge>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Campaign Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.map((option) => {
                      const isSelected = (filters.category || []).includes(option.value)
                      return (
                        <motion.div
                          key={option.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Badge
                            variant={isSelected ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer transition-all duration-200",
                              isSelected && "ring-2 ring-primary/20"
                            )}
                            onClick={() => toggleArrayFilter('category', option.value)}
                          >
                            {option.label}
                          </Badge>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Campaign Status</Label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((option) => {
                      const isSelected = (filters.status || []).includes(option.value)
                      return (
                        <motion.div
                          key={option.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Badge
                            variant={isSelected ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer transition-all duration-200",
                              isSelected && "ring-2 ring-primary/20"
                            )}
                            onClick={() => toggleArrayFilter('status', option.value)}
                          >
                            {option.label}
                          </Badge>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Campaign Type Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Campaign Type</Label>
                  <div className="flex flex-wrap gap-2">
                    {campaignTypeOptions.map((option) => {
                      const isSelected = (filters.campaignType || []).includes(option.value)
                      return (
                        <motion.div
                          key={option.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Badge
                            variant={isSelected ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer transition-all duration-200",
                              isSelected && "ring-2 ring-primary/20"
                            )}
                            onClick={() => toggleArrayFilter('campaignType', option.value)}
                          >
                            {option.label}
                          </Badge>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                {/* Device and Location Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Device Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Device Type</Label>
                    <div className="flex flex-wrap gap-2">
                      {deviceOptions.map((option) => {
                        const isSelected = (filters.device || []).includes(option.value)
                        return (
                          <Badge
                            key={option.value}
                            variant={isSelected ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer transition-all duration-200",
                              isSelected && "ring-2 ring-primary/20"
                            )}
                            onClick={() => toggleArrayFilter('device', option.value)}
                          >
                            {option.label}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Location</Label>
                    <div className="flex flex-wrap gap-2">
                      {locationOptions.map((option) => {
                        const isSelected = (filters.location || []).includes(option.value)
                        return (
                          <Badge
                            key={option.value}
                            variant={isSelected ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer transition-all duration-200 text-xs",
                              isSelected && "ring-2 ring-primary/20"
                            )}
                            onClick={() => toggleArrayFilter('location', option.value)}
                          >
                            {option.label}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Range Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cost Range Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Cost Range: ${filters.costRange?.[0] || 0} - ${filters.costRange?.[1] || 10000}
                    </Label>
                    <Slider
                      value={filters.costRange || [0, 10000]}
                      onValueChange={(value) => updateFilters({ costRange: value as [number, number] })}
                      max={10000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  {/* Revenue Range Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Revenue Range: ${filters.revenueRange?.[0] || 0} - ${filters.revenueRange?.[1] || 50000}
                    </Label>
                    <Slider
                      value={filters.revenueRange || [0, 50000]}
                      onValueChange={(value) => updateFilters({ revenueRange: value as [number, number] })}
                      max={50000}
                      min={0}
                      step={1000}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Impressions Range Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Impressions: {(filters.impressionsRange?.[0] || 0).toLocaleString()} - {(filters.impressionsRange?.[1] || 500000).toLocaleString()}
                    </Label>
                    <Slider
                      value={filters.impressionsRange || [0, 500000]}
                      onValueChange={(value) => updateFilters({ impressionsRange: value as [number, number] })}
                      max={500000}
                      min={0}
                      step={10000}
                      className="w-full"
                    />
                  </div>

                  {/* Clicks Range Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Clicks: {(filters.clicksRange?.[0] || 0).toLocaleString()} - {(filters.clicksRange?.[1] || 25000).toLocaleString()}
                    </Label>
                    <Slider
                      value={filters.clicksRange || [0, 25000]}
                      onValueChange={(value) => updateFilters({ clicksRange: value as [number, number] })}
                      max={25000}
                      min={0}
                      step={500}
                      className="w-full"
                    />
                  </div>

                  {/* Conversions Range Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Conversions: {filters.conversionRange?.[0] || 0} - {filters.conversionRange?.[1] || 5000}
                    </Label>
                    <Slider
                      value={filters.conversionRange || [0, 5000]}
                      onValueChange={(value) => updateFilters({ conversionRange: value as [number, number] })}
                      max={5000}
                      min={0}
                      step={50}
                      className="w-full"
                    />
                  </div>
                </div>

                <Separator />

                {/* Date Range Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Date Range</Label>
                  <DateRangePicker
                    value={filters.dateRange}
                    onChange={(range) => updateFilters({ dateRange: range || { from: undefined, to: undefined } })}
                    placeholder="Select date range"
                  />
                </div>

                <Separator />

                {/* Sort Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Sort By</Label>
                    <Select
                      value={filters.sortBy || "date"}
                      onValueChange={(value) => updateFilters({ sortBy: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Sort Order</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={(filters.sortOrder || 'desc') === 'asc' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateFilters({ sortOrder: 'asc' })}
                        className="flex-1 gap-2"
                      >
                        <SortAsc className="h-4 w-4" />
                        Ascending
                      </Button>
                      <Button
                        variant={(filters.sortOrder || 'desc') === 'desc' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateFilters({ sortOrder: 'desc' })}
                        className="flex-1 gap-2"
                      >
                        <SortDesc className="h-4 w-4" />
                        Descending
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Quick Filters */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Quick Filters</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="profitable"
                        checked={filters.showOnlyProfitable}
                        onCheckedChange={(checked) => updateFilters({ showOnlyProfitable: !!checked })}
                      />
                      <Label htmlFor="profitable" className="text-sm cursor-pointer">
                        Show only profitable campaigns
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="active"
                        checked={filters.showOnlyActive}
                        onCheckedChange={(checked) => updateFilters({ showOnlyActive: !!checked })}
                      />
                      <Label htmlFor="active" className="text-sm cursor-pointer">
                        Show only active campaigns
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}