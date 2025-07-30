"use client"

import { DataTable } from "./DataTable"
import { ColumnDef } from "@tanstack/react-table"

interface TestData {
  id: string
  name: string
  value: number
}

const testColumns: ColumnDef<TestData>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
]

const testData: TestData[] = [
  { id: "1", name: "Test 1", value: 100 },
  { id: "2", name: "Test 2", value: 200 },
  { id: "3", name: "Test 3", value: 300 },
]

export function DataTableTest() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">DataTable Test</h2>
      <DataTable
        columns={testColumns}
        data={testData}
        searchKey="name"
        searchPlaceholder="Search names..."
      />
    </div>
  )
}