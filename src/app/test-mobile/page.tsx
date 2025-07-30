"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UnifiedFilteringDemo } from "@/components/dashboard/UnifiedFilteringDemo";
import { ResponsiveLayoutDemo } from "@/components/dashboard/ResponsiveLayoutDemo";
import { Smartphone, Tablet, Monitor } from "lucide-react";

export default function TestMobilePage() {
  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Mobile Responsiveness Test</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Test the responsive design across different screen sizes and devices
        </p>
      </div>

      {/* Device Simulation Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📱 Device Testing Guide
          </CardTitle>
          <CardDescription>
            Test the following features on different screen sizes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <Smartphone className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium text-green-800 dark:text-green-200">Mobile (320px+)</div>
                <div className="text-xs text-green-600 dark:text-green-300">Stacked layout, touch-friendly</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <Tablet className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium text-blue-800 dark:text-blue-200">Tablet (768px+)</div>
                <div className="text-xs text-blue-600 dark:text-blue-300">2-column grid</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <Monitor className="h-5 w-5 text-purple-600" />
              <div>
                <div className="font-medium text-purple-800 dark:text-purple-200">Desktop (1024px+)</div>
                <div className="text-xs text-purple-600 dark:text-purple-300">Full grid layout</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test: Unified Filtering Demo */}
      <Card>
        <CardHeader>
          <CardTitle>🔍 Filtering System Test</CardTitle>
          <CardDescription>
            Test the tabbed filtering interface and horizontal table scrolling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UnifiedFilteringDemo />
        </CardContent>
      </Card>

      {/* Test: Responsive Layout */}
      <Card>
        <CardHeader>
          <CardTitle>📐 Layout Responsiveness Test</CardTitle>
          <CardDescription>
            Test grid responsiveness and component adaptation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveLayoutDemo />
        </CardContent>
      </Card>

      {/* Mobile Instructions */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-amber-800 dark:text-amber-200">📋 Testing Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
            <p className="font-medium">✅ Test the following on mobile devices:</p>
            <ul className="space-y-1 ml-4">
              <li>• Filtering tabs stack vertically on mobile</li>
              <li>• Table scrolls horizontally with clear indicators</li>
              <li>• Touch targets are at least 44px for easy tapping</li>
              <li>• Text remains readable at small sizes</li>
              <li>• No horizontal overflow on the page</li>
              <li>• Smooth scrolling and touch gestures</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
