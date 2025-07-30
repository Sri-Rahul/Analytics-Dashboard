"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { TableRow } from "@/lib/data"
import { SortableHeader, ActionCell } from "./DataTable"
import { motion } from "framer-motion"

// Format currency values
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

// Format numbers with commas
const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value)
}

// Format dates
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

// Calculate ROI percentage
const calculateROI = (revenue: number, cost: number) => {
  if (cost === 0) return 0
  return ((revenue - cost) / cost) * 100
}

// Get performance badge variant based on ROI
const getPerformanceBadge = (roi: number) => {
  if (roi >= 100) return { variant: "default" as const, label: "Excellent" }
  if (roi >= 50) return { variant: "secondary" as const, label: "Good" }
  if (roi >= 0) return { variant: "outline" as const, label: "Fair" }
  return { variant: "destructive" as const, label: "Poor" }
}

export const campaignColumns: ColumnDef<TableRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "campaign",
    header: ({ column }) => (
      <SortableHeader column={column}>
        Campaign
      </SortableHeader>
    ),
    cell: ({ row }) => (
      <motion.div
        className="font-medium"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.1 }}
      >
        {row.getValue("campaign")}
      </motion.div>
    ),
  },
  {
    accessorKey: "impressions",
    header: ({ column }) => (
      <SortableHeader column={column}>
        Impressions
      </SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono">
        {formatNumber(row.getValue("impressions"))}
      </div>
    ),
  },
  {
    accessorKey: "clicks",
    header: ({ column }) => (
      <SortableHeader column={column}>
        Clicks
      </SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono">
        {formatNumber(row.getValue("clicks"))}
      </div>
    ),
  },
  {
    accessorKey: "conversions",
    header: ({ column }) => (
      <SortableHeader column={column}>
        Conversions
      </SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono">
        {formatNumber(row.getValue("conversions"))}
      </div>
    ),
  },
  {
    accessorKey: "cost",
    header: ({ column }) => (
      <SortableHeader column={column}>
        Cost
      </SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono">
        {formatCurrency(row.getValue("cost"))}
      </div>
    ),
  },
  {
    accessorKey: "revenue",
    header: ({ column }) => (
      <SortableHeader column={column}>
        Revenue
      </SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono font-semibold">
        {formatCurrency(row.getValue("revenue"))}
      </div>
    ),
  },
  {
    id: "roi",
    header: ({ column }) => (
      <SortableHeader column={column}>
        ROI
      </SortableHeader>
    ),
    cell: ({ row }) => {
      const cost = row.getValue("cost") as number
      const revenue = row.getValue("revenue") as number
      const roi = calculateROI(revenue, cost)
      
      return (
        <div className="text-right">
          <span className="font-mono">
            {roi.toFixed(1)}%
          </span>
        </div>
      )
    },
    sortingFn: (rowA, rowB) => {
      const roiA = calculateROI(
        rowA.getValue("revenue") as number,
        rowA.getValue("cost") as number
      )
      const roiB = calculateROI(
        rowB.getValue("revenue") as number,
        rowB.getValue("cost") as number
      )
      return roiA - roiB
    },
  },
  {
    id: "performance",
    header: "Performance",
    cell: ({ row }) => {
      const cost = row.getValue("cost") as number
      const revenue = row.getValue("revenue") as number
      const roi = calculateROI(revenue, cost)
      const badge = getPerformanceBadge(roi)
      
      return (
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.1 }}
        >
          <Badge variant={badge.variant}>
            {badge.label}
          </Badge>
        </motion.div>
      )
    },
    sortingFn: (rowA, rowB) => {
      const roiA = calculateROI(
        rowA.getValue("revenue") as number,
        rowA.getValue("cost") as number
      )
      const roiB = calculateROI(
        rowB.getValue("revenue") as number,
        rowB.getValue("cost") as number
      )
      return roiA - roiB
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <SortableHeader column={column}>
        Date
      </SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.getValue("date"))}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionCell row={row} />,
  },
]