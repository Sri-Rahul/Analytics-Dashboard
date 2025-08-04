"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { MagicCard } from "@/components/ui/magic-card"
import { BorderBeam } from "@/components/ui/border-beam"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SearchInput } from "@/components/ui/search-input"
import { FilterPanel, FilterState } from "./FilterPanel"
import { EnhancedPagination } from "./EnhancedPagination"
import { VirtualTable } from "./VirtualTable"
import { ExportButtons } from "./ExportButtons"
import { DataTableErrorBoundary } from "./DataTableErrorBoundary"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  enableAdvancedFiltering?: boolean
  enableVirtualization?: boolean
  virtualHeight?: number
  pageSizeOptions?: number[]
  defaultPageSize?: number
  enableExport?: boolean
  exportFilename?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  enableAdvancedFiltering = true,
  enableVirtualization = false,
  virtualHeight = 400,
  pageSizeOptions = [10, 20, 50, 100],
  defaultPageSize = 10,
  enableExport = true,
  exportFilename = "analytics-data",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [searchValue, setSearchValue] = React.useState("")
  const [isFilterPanelOpen, setIsFilterPanelOpen] = React.useState(false)
  
  // Advanced filtering state
  const [filters, setFilters] = React.useState<FilterState>({
    performance: [],
    costRange: [0, 10000],
    revenueRange: [0, 50000],
    impressionsRange: [0, 100000],
    clicksRange: [0, 10000],
    conversionRange: [0, 100],
    dateRange: { from: undefined, to: undefined },
    category: [],
    status: [],
    campaignType: [],
    device: [],
    location: [],
    searchTerm: "",
    sortBy: "",
    sortOrder: 'asc' as const,
    showOnlyProfitable: false,
    showOnlyActive: false
  })

  // Calculate ROI for filtering
  const calculateROI = (revenue: number, cost: number) => {
    if (cost === 0) return 0
    return ((revenue - cost) / cost) * 100
  }

  // Get performance category based on ROI
  const getPerformanceCategory = (roi: number) => {
    if (roi >= 100) return "excellent"
    if (roi >= 50) return "good"
    if (roi >= 0) return "fair"
    return "poor"
  }

  // Filter data based on advanced filters
  const filteredData = React.useMemo(() => {
    if (!enableAdvancedFiltering) return data

    return data.filter((row: any) => {
      // Performance filter
      if (filters.performance.length > 0) {
        const roi = calculateROI(row.revenue, row.cost)
        const category = getPerformanceCategory(roi)
        if (!filters.performance.includes(category)) return false
      }

      // Cost range filter
      if (row.cost < filters.costRange[0] || row.cost > filters.costRange[1]) {
        return false
      }

      // Revenue range filter
      if (row.revenue < filters.revenueRange[0] || row.revenue > filters.revenueRange[1]) {
        return false
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const rowDate = new Date(row.date)
        if (filters.dateRange.from && rowDate < filters.dateRange.from) return false
        if (filters.dateRange.to && rowDate > filters.dateRange.to) return false
      }

      return true
    })
  }, [data, filters, enableAdvancedFiltering])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Pagination state
  const currentPage = (table && typeof table.getState === 'function' && table.getState().pagination?.pageIndex !== undefined) ? 
    table.getState().pagination.pageIndex + 1 : 1
  const totalPages = (table && typeof table.getPageCount === 'function') ? table.getPageCount() : 1
  const pageSize = (table && typeof table.getState === 'function' && table.getState().pagination?.pageSize) ? 
    table.getState().pagination.pageSize : defaultPageSize
  const totalItems = filteredData.length

  const handlePageChange = (page: number) => {
    if (table && typeof table.setPageIndex === 'function') {
      table.setPageIndex(page - 1)
    }
  }

  const handlePageSizeChange = (newPageSize: number) => {
    if (table && typeof table.setPageSize === 'function' && typeof table.setPageIndex === 'function') {
      table.setPageSize(newPageSize)
      table.setPageIndex(0) // Reset to first page when changing page size
    }
  }

  // Update search filter when search value changes
  React.useEffect(() => {
    if (searchKey && table && typeof table.getColumn === 'function') {
      const column = table.getColumn(searchKey)
      if (column && typeof column.setFilterValue === 'function') {
        column.setFilterValue(searchValue)
      }
    }
  }, [searchValue, searchKey, table])

  // Determine if we should use virtualization based on data size
  const shouldUseVirtualization = enableVirtualization || filteredData.length > 1000

  // Show loading state if table is not ready
  if (!table || 
      typeof table.getAllColumns !== 'function' || 
      !table.getHeaderGroups || 
      !table.getRowModel) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center gap-4 py-4">
          <div className="h-10 w-64 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded ml-auto" />
        </div>
        <div className="rounded-md border">
          <div className="h-64 bg-muted animate-pulse" />
        </div>
      </div>
    )
  }

  // Additional safety check for table methods
  try {
    if (table.getAllColumns && typeof table.getAllColumns === 'function') {
      const testColumns = table.getAllColumns();
      if (!testColumns || !Array.isArray(testColumns)) {
        return (
          <div className="w-full space-y-4">
            <div className="flex items-center gap-4 py-4">
              <div className="h-10 w-64 bg-muted animate-pulse rounded" />
              <div className="h-10 w-32 bg-muted animate-pulse rounded ml-auto" />
            </div>
            <div className="rounded-md border">
              <div className="h-64 bg-muted animate-pulse" />
            </div>
          </div>
        )
      }
    }
  } catch (error) {
    console.error('Table initialization error:', error);
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center gap-4 py-4">
          <div className="h-10 w-64 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded ml-auto" />
        </div>
        <div className="rounded-md border">
          <div className="h-64 bg-muted animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <DataTableErrorBoundary>
      <div className="w-full max-w-none mx-auto space-y-4">
      {/* Advanced Filter Panel */}
      {enableAdvancedFiltering && (
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          isOpen={isFilterPanelOpen}
          onToggle={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
        />
      )}

      {/* Search and Column Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 py-4 w-full max-w-none" role="toolbar" aria-label="Table controls">
        {searchKey && (
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            placeholder={searchPlaceholder}
            className="w-full sm:flex-1 sm:min-w-[200px] sm:max-w-md"
            onClear={() => setSearchValue("")}
            aria-label={`Search ${searchPlaceholder.toLowerCase()}`}
          />
        )}
        
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto sm:ml-auto">
          {/* Results count with animation */}
          <motion.div
            key={filteredData.length}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-muted-foreground"
          >
            {filteredData.length} result{filteredData.length !== 1 ? 's' : ''}
          </motion.div>

          {/* Export buttons */}
          {enableExport && (
            <ExportButtons 
              data={filteredData as any}
              filename={exportFilename}
            />
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" aria-label="Toggle column visibility">
                Columns <ChevronDown className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" aria-label="Column visibility options">
              {(() => {
                if (!table || typeof table.getAllColumns !== 'function') {
                  return [];
                }
                
                try {
                  const columns = table.getAllColumns();
                  if (!columns || !Array.isArray(columns)) {
                    return [];
                  }
                  
                  return columns
                    .filter((column) => column && typeof column.getCanHide === 'function' && column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={typeof column.getIsVisible === 'function' ? column.getIsVisible() : false}
                          onCheckedChange={(value) =>
                            typeof column.toggleVisibility === 'function' && column.toggleVisibility(!!value)
                          }
                          aria-label={`Toggle ${column.id} column visibility`}
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      )
                    });
                } catch (error) {
                  console.error('Error getting table columns:', error);
                  return [];
                }
              })()}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table Content - Virtual or Regular */}
      {shouldUseVirtualization ? (
        <VirtualTable
          columns={columns}
          data={table && table.getRowModel && table.getRowModel().rows ? 
            table.getRowModel().rows.map(row => row.original) : []}
          height={virtualHeight}
        />
      ) : (
        <div className="w-full max-w-none mx-auto rounded-md border bg-card shadow-sm relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            role="region"
            aria-label="Data table"
            className="w-full max-w-none"
          >
          {/* Responsive table wrapper - centered and full width */}
          <div className="w-full max-w-none mx-auto">
            {/* Mobile scroll hint - only show on small screens */}
            <div className="sm:hidden absolute top-2 right-2 text-xs text-muted-foreground opacity-70 animate-pulse bg-background/90 px-2 py-1 rounded backdrop-blur-sm border z-10">
              👆 Scroll →
            </div>
            
            {/* Enhanced scrollable table container - responsive and centered */}
            <div className="responsive-table-container w-full">
              <Table role="table" aria-label="Analytics data table" className="w-full"
                style={{ 
                  minWidth: '100%',
                  width: '100%'
                }}
              >
            <TableHeader>
              {table?.getHeaderGroups()?.map((headerGroup) => (
                <TableRow key={headerGroup.id} role="row">
                  {headerGroup.headers.map((header, index) => {
                    return (
                      <TableHead 
                        key={header.id}
                        role="columnheader"
                        className="text-left px-2 sm:px-4 py-3 font-medium text-xs sm:text-sm border-r border-border/20 last:border-r-0 bg-muted/20 whitespace-nowrap"
                        style={{ 
                          minWidth: '120px',
                          width: 'auto'
                        }}
                        aria-sort={
                          header.column.getIsSorted() === "asc" ? "ascending" :
                          header.column.getIsSorted() === "desc" ? "descending" :
                          header.column.getCanSort() ? "none" : undefined
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="wait">
                {table?.getRowModel()?.rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <motion.tr
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ 
                        duration: 0.2, 
                        delay: index * 0.02,
                        ease: "easeOut"
                      }}
                      layout
                      role="row"
                      aria-selected={row.getIsSelected()}
                    >
                      {row.getVisibleCells().map((cell, cellIndex) => (
                        <TableCell 
                          key={cell.id} 
                          role="cell"
                          className="px-2 sm:px-4 py-3 text-xs sm:text-sm border-r border-border/10 last:border-r-0"
                          style={{ 
                            minWidth: '120px',
                            width: 'auto'
                          }}
                        >
                          <div className="truncate max-w-[150px] sm:max-w-none" title={String(cell.getValue())}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))
                ) : (
                  <TableRow role="row">
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                      role="cell"
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        role="status"
                        aria-live="polite"
                      >
                        No results found.
                      </motion.div>
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
            </div> {/* Close overflow-x-auto div */}
          </div> {/* Close table container div */}
          </motion.div>
        </div>
      )}

      {/* Selection Info */}
      {table?.getFilteredSelectedRowModel()?.rows?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground"
        >
          {table?.getFilteredSelectedRowModel()?.rows?.length || 0} of{" "}
          {table?.getFilteredRowModel()?.rows?.length || 0} row(s) selected.
        </motion.div>
      )}

      {/* Enhanced Pagination */}
      {!shouldUseVirtualization && (
        <EnhancedPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={pageSizeOptions}
          showPageSizeSelector={true}
          showFirstLast={true}
          maxVisiblePages={5}
        />
      )}
      </div>
    </DataTableErrorBoundary>
  )
}

// Sortable column header component
export function SortableHeader({ column, children }: {
  column: any
  children: React.ReactNode
}) {
  const sortDirection = column.getIsSorted()
  const ariaLabel = `Sort by ${children}${
    sortDirection === "asc" ? " descending" : 
    sortDirection === "desc" ? " ascending" : ""
  }`

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-auto p-0 hover:bg-transparent"
      aria-label={ariaLabel}
    >
      <span className="flex items-center">
        {children}
        <motion.div
          className="ml-2"
          animate={{
            rotate: column.getIsSorted() === "desc" ? 180 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <ArrowUpDown 
            className="h-4 w-4" 
            aria-hidden="true"
          />
        </motion.div>
      </span>
    </Button>
  )
}

// Action cell component for row actions
export function ActionCell<TData>({ row }: { row: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0"
          aria-label={`Actions for row ${row.index + 1}`}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" aria-label="Row actions">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(row.original.id)}
        >
          Copy ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View details</DropdownMenuItem>
        <DropdownMenuItem>Edit</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}