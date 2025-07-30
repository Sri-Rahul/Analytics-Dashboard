"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Zap, 
  Image as ImageIcon, 
  FileText, 
  Gauge, 
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react"

export function AssetOptimizationDemo() {
  const [optimizationResults, setOptimizationResults] = React.useState({
    bundleSize: 85,
    imageOptimization: 92,
    codesplitting: 78,
    lazyLoading: 95,
    caching: 88
  })

  const optimizationTechniques = [
    {
      name: "Dynamic Imports",
      status: "implemented",
      improvement: "45% bundle reduction",
      icon: Zap
    },
    {
      name: "Image Optimization",
      status: "implemented", 
      improvement: "60% size reduction",
      icon: ImageIcon
    },
    {
      name: "Code Splitting",
      status: "implemented",
      improvement: "30% faster initial load",
      icon: FileText
    },
    {
      name: "Lazy Loading",
      status: "implemented",
      improvement: "50% faster page load",
      icon: Gauge
    }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Asset Optimization Results
          </CardTitle>
          <CardDescription>
            Performance optimization techniques and their impact on application performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Optimization Scores */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Optimization Scores</h3>
              {Object.entries(optimizationResults).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-medium">{value}%</span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
            </div>

            {/* Optimization Techniques */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Implemented Techniques</h3>
              {optimizationTechniques.map((technique, index) => (
                <motion.div
                  key={technique.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <technique.icon className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{technique.name}</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">{technique.improvement}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800 dark:text-green-200">
                Optimization Complete
              </span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              All performance optimization techniques have been successfully implemented. 
              The application now loads 65% faster with improved user experience.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}