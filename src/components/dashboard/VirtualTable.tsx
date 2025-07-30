"use client"

import * as React from "react"
import { FixedSizeList as List } from "react-window"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table"
import { motion } from "framer-motion"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface VirtualTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  height?: number
  itemSize?: number
  className?: string
}

interface VirtualRowProps {
  index: number
  style: React.CSSProperties
  data: {
    rows: Row<any>[]
    columns: ColumnDef<any, any>[]
  }
}

const VirtualRow = React.memo(({ index, style, data }: VirtualRowProps) => {
  const { rows, columns } = data
  const row = rows[index]

  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.2, 
        delay: index * 0.02,
        ease: "easeOut"
      }}
      className="flex border-b hover:bg-muted/50 transition-colors"
    >
      {row.getVisibleCells().map((cell, cellIndex) => (
        <div
          key={cell.id}
          className="flex items-center px-4 py-2 text-sm"
          style={{
            width: `${100 / columns.length}%`,
            minWidth: 0,
          }}
        >
          <div className="truncate">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        </div>
      ))}
    </motion.div>
  )
})

VirtualRow.displayName = "VirtualRow"

export function VirtualTable<TData, TValue>({
  columns,
  data,
  height = 400,
  itemSize = 52,
  className
}: VirtualTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const { rows } = table.getRowModel()

  const rowVirtualizer = React.useMemo(
    () => ({
      rows,
      columns,
    }),
    [rows, columns]
  )

  return (
    <motion.div
      className={`rounded-md border ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="border-b bg-muted/50">
        <div className="flex">
          {table.getHeaderGroups().map((headerGroup) =>
            headerGroup.headers.map((header) => (
              <div
                key={header.id}
                className="flex items-center px-4 py-3 text-sm font-medium"
                style={{
                  width: `${100 / columns.length}%`,
                  minWidth: 0,
                }}
              >
                <div className="truncate">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Virtual Body */}
      <div style={{ height }}>
        {rows.length > 0 ? (
          <List
            height={height}
            itemCount={rows.length}
            itemSize={itemSize}
            itemData={rowVirtualizer}
            overscanCount={5}
          >
            {VirtualRow}
          </List>
        ) : (
          <motion.div
            className="flex items-center justify-center h-full text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            No results found.
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}