"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TestTableScrollPage() {
  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Table Scroll Debug</h1>
        <p className="text-muted-foreground">
          Test horizontal scrolling with a simple table structure
        </p>
      </div>

      {/* Simple Scrollable Table Test */}
      <Card>
        <CardHeader>
          <CardTitle>🔍 Simple Table Test</CardTitle>
          <CardDescription>
            Basic table with horizontal scroll - should work on mobile
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mobile Instructions */}
          <div className="md:hidden mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 text-blue-800 dark:text-blue-200">
              <span className="text-xl">👆</span>
              <div>
                <div className="font-medium">Test Instructions</div>
                <div className="text-sm">Try swiping left on the table below</div>
              </div>
            </div>
          </div>

          {/* Scrollable Table Container */}
          <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
            <div className="w-full overflow-x-auto mobile-scroll-table">
              <table className="w-full" style={{ minWidth: '1000px' }}>
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium min-w-[120px]">Campaign</th>
                    <th className="text-left p-4 font-medium min-w-[120px]">Impressions</th>
                    <th className="text-left p-4 font-medium min-w-[120px]">Clicks</th>
                    <th className="text-left p-4 font-medium min-w-[120px]">Conversions</th>
                    <th className="text-left p-4 font-medium min-w-[120px]">Cost</th>
                    <th className="text-left p-4 font-medium min-w-[120px]">Revenue</th>
                    <th className="text-left p-4 font-medium min-w-[120px]">ROI</th>
                    <th className="text-left p-4 font-medium min-w-[120px]">Performance</th>
                    <th className="text-left p-4 font-medium min-w-[120px]">Date</th>
                    <th className="text-left p-4 font-medium min-w-[120px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }, (_, i) => (
                    <tr key={i} className="border-b hover:bg-muted/50">
                      <td className="p-4">Summer Campaign {i + 1}</td>
                      <td className="p-4 font-mono">15,{(243 + i * 100).toLocaleString()}</td>
                      <td className="p-4 font-mono">{(1234 + i * 50).toLocaleString()}</td>
                      <td className="p-4 font-mono">{(89 + i * 10).toLocaleString()}</td>
                      <td className="p-4 font-mono">${(1500 + i * 200).toLocaleString()}</td>
                      <td className="p-4 font-mono font-semibold">${(4500 + i * 800).toLocaleString()}</td>
                      <td className="p-4 font-mono">{(200 + i * 50).toFixed(1)}%</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Excellent
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">Jan {15 + i}, 2024</td>
                      <td className="p-4">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Scroll Indicator */}
            <div className="md:hidden p-3 bg-muted/30 border-t text-center">
              <div className="text-sm text-muted-foreground">
                ← Scroll to see all columns →
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Info */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-200">✅ Expected Behavior</CardTitle>
        </CardHeader>
        <CardContent className="text-green-700 dark:text-green-300 space-y-2">
          <p className="font-medium">On mobile devices, you should be able to:</p>
          <ul className="space-y-1 ml-4 text-sm">
            <li>• Swipe left to scroll to the Date column and beyond</li>
            <li>• See all 10 columns: Campaign → Actions</li>
            <li>• Smooth scrolling without getting stuck</li>
            <li>• Clear scroll indicators</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
